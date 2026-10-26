import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { parseCSVFeedback } from "@/lib/csv-parser";
import { analyzeFeedbackWithNLP } from "@/lib/nlp-client";
import { prisma } from "@/lib/prisma";
import { computeTopicClusters } from "@/lib/topic-clustering";
import { computeBusinessIssues } from "@/lib/priority-engine";
import { computeActionRecommendations } from "@/lib/recommendations-engine";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded. Please select a valid CSV file." },
        { status: 400 }
      );
    }

    const text = await file.text();
    const rows = parseCSVFeedback(text);

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid feedback rows found in the uploaded file. Check headers and content.",
        },
        { status: 400 }
      );
    }

    // Resolve active business
    let clerkUser = null;
    try { clerkUser = await currentUser(); } catch {}
    const clerkId = clerkUser?.id;

    let business = null;
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: clerkId },
        include: { businesses: true },
      });
      business = user?.businesses?.[0] ?? null;
    }

    if (!business) {
      business = await prisma.business.findFirst({ orderBy: { updatedAt: "desc" } });
    }

    // If no business exists at all in DB, create default user & business
    if (!business) {
      const defaultUser = await prisma.user.upsert({
        where: { clerkUserId: clerkId || "usr_default_admin" },
        update: {},
        create: {
          clerkUserId: clerkId || "usr_default_admin",
          email: clerkUser?.emailAddresses?.[0]?.emailAddress || "admin@feedbackos.io",
          name: clerkUser?.fullName || "Business Administrator",
          role: "OWNER",
        },
      });

      business = await prisma.business.create({
        data: {
          name: "The Heritage Bistro & Kitchen",
          industry: "Restaurant & Hospitality",
          userId: defaultUser.id,
        },
      });
    }

    // Perform AI NLP Sentiment Analysis & Topic Extraction
    const nlpPayload = rows.map((r, idx) => ({
      id: `row_${idx}`,
      content: r.content,
      rating: r.rating,
      author: r.authorName,
      source: r.source,
    }));

    const nlpSummary = await analyzeFeedbackWithNLP(nlpPayload, business.name);

    // Map NLP results to database records
    const feedbackRecords = nlpSummary.results.map((res, idx) => {
      const origRow = rows[idx];
      return {
        businessId: business.id,
        content: res.content,
        rating: origRow?.rating || 5,
        authorName: origRow?.authorName || "Anonymous",
        source: origRow?.source || "CSV Batch Upload",
        sentiment: res.sentiment,
        sentimentScore: res.sentiment_score,
        confidence: res.confidence,
        priority: res.priority,
        topics: JSON.stringify(res.topics || []),
      };
    });

    // Save feedbacks to database
    await prisma.feedback.createMany({
      data: feedbackRecords,
    });

    // Fetch all current feedbacks for this business to refresh aggregated tables
    const allFeedbacks = await prisma.feedback.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    const rawFeedbacks = allFeedbacks.map((f) => {
      let topicsArr: string[] = [];
      try {
        if (typeof f.topics === "string") topicsArr = JSON.parse(f.topics);
        else if (Array.isArray(f.topics)) topicsArr = f.topics as any;
      } catch {}
      return {
        content: f.content,
        rating: f.rating,
        sentiment: f.sentiment,
        topics: topicsArr,
      };
    });

    // Sync Topics
    try {
      const computedTopics = computeTopicClusters(rawFeedbacks);
      for (const t of computedTopics) {
        await prisma.topic.upsert({
          where: {
            businessId_name: {
              businessId: business.id,
              name: t.name,
            },
          },
          update: {
            mentionCount: t.count,
            positivePct: t.positivePercentage,
            negativePct: Math.round((t.negative / t.count) * 100),
            neutralPct: Math.round((t.neutral / t.count) * 100),
          },
          create: {
            businessId: business.id,
            name: t.name,
            category: "General",
            mentionCount: t.count,
            positivePct: t.positivePercentage,
            negativePct: Math.round((t.negative / t.count) * 100),
            neutralPct: Math.round((t.neutral / t.count) * 100),
          },
        });
      }
    } catch (e) {
      console.error("Failed to sync topics:", e);
    }

    // Sync Issues
    try {
      const computedIssues = computeBusinessIssues(rawFeedbacks);
      for (const iss of computedIssues) {
        const existing = await prisma.issue.findFirst({
          where: { businessId: business.id, title: iss.title },
        });

        if (existing) {
          await prisma.issue.update({
            where: { id: existing.id },
            data: {
              priority: iss.priority,
              mentionCount: iss.mentions,
              trend: iss.trend,
              exampleFeedback: iss.exampleFeedback[0] || null,
              suggestedAction: iss.recommendedAction,
            },
          });
        } else {
          await prisma.issue.create({
            data: {
              businessId: business.id,
              title: iss.title,
              description: iss.recommendedAction,
              priority: iss.priority,
              status: "PENDING",
              mentionCount: iss.mentions,
              trend: iss.trend,
              exampleFeedback: iss.exampleFeedback[0] || null,
              suggestedAction: iss.recommendedAction,
            },
          });
        }
      }
    } catch (e) {
      console.error("Failed to sync issues:", e);
    }

    // Sync Recommendations
    try {
      const computedRecs = computeActionRecommendations(rawFeedbacks);
      for (const rec of computedRecs) {
        const existing = await prisma.recommendation.findFirst({
          where: { businessId: business.id, title: rec.title },
        });

        if (!existing) {
          await prisma.recommendation.create({
            data: {
              businessId: business.id,
              category: rec.category,
              title: rec.title,
              whyItMatters: rec.whyItMatters,
              actionStep: rec.recommendedAction,
              priority: rec.priority,
              status: "PENDING",
            },
          });
        }
      }
    } catch (e) {
      console.error("Failed to sync recommendations:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully analyzed and saved ${rows.length} customer feedback items into your live database.`,
      count: rows.length,
      overallSentiment: nlpSummary.overall_sentiment,
      positivePercentage: nlpSummary.positive_percentage,
      negativePercentage: nlpSummary.negative_percentage,
      averageConfidence: nlpSummary.average_confidence,
      savedToDb: true,
      businessName: business.name,
      preview: feedbackRecords.slice(0, 3),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process uploaded file.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
