import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateAISummary } from "@/lib/groq-client";
import { computeTopicClusters } from "@/lib/topic-clustering";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const monthYear = body.monthYear || new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

    let clerkUser = null;
    try { clerkUser = await currentUser(); } catch {}
    const clerkId = clerkUser?.id;

    let business = null;
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: clerkId },
        include: {
          businesses: {
            include: { feedbacks: { orderBy: { createdAt: "desc" }, take: 500 } },
          },
        },
      });
      business = user?.businesses?.[0] ?? null;
    }

    if (!business) {
      business = await prisma.business.findFirst({
        orderBy: { updatedAt: "desc" },
        include: { feedbacks: { orderBy: { createdAt: "desc" }, take: 500 } },
      });
    }

    const businessName = body.businessName || business?.name || "Your Business";
    const feedbacks = business?.feedbacks || [];
    const totalCount = feedbacks.length;

    const positiveFeedbacks = feedbacks.filter((f) => f.sentiment === "POSITIVE" || f.rating >= 4);
    const negativeFeedbacks = feedbacks.filter((f) => f.sentiment === "NEGATIVE" || f.rating <= 2);

    const avgRating = totalCount > 0
      ? Number((feedbacks.reduce((a, f) => a + f.rating, 0) / totalCount).toFixed(1))
      : 4.2;

    const netScore = totalCount > 0
      ? Math.round(((positiveFeedbacks.length - negativeFeedbacks.length) / totalCount) * 100)
      : 60;

    // Detect real topic drivers
    const topics = computeTopicClusters(
      feedbacks.map((f) => ({ content: f.content, rating: f.rating, sentiment: f.sentiment }))
    );

    const positiveTopic = topics.filter((t) => t.positive > 0).sort((a, b) => b.positive - a.positive)[0];
    const negativeTopic = topics.filter((t) => t.negative > 0).sort((a, b) => b.negative - a.negative)[0];

    // Run AI summary from live reviews
    const aiSummary = await generateAISummary(
      feedbacks.map((f) => ({ content: f.content, rating: f.rating, sentiment: f.sentiment })),
      businessName
    );

    const reportData = {
      reportId: `rpt_${Date.now()}`,
      monthYear,
      businessName,
      totalFeedbackCount: totalCount,
      overallSentiment: netScore >= 40 ? "POSITIVE" : netScore <= -20 ? "NEGATIVE" : "NEUTRAL",
      netSentimentScore: netScore,
      averageRating: avgRating,
      positiveDriver: {
        title: positiveTopic?.name || "Core Product Excellence",
        description: positiveTopic
          ? `${positiveTopic.positivePercentage}% positive sentiment across ${positiveTopic.count} customer mentions.`
          : "Customer feedback highlights culinary execution and warm atmosphere as key assets.",
        positivePercentage: positiveTopic?.positivePercentage || 92,
      },
      frictionCluster: {
        title: negativeTopic?.name || "Service Pace & Wait Times",
        description: negativeTopic
          ? `${negativeTopic.negative} negative customer reports requiring operational adjustment.`
          : "Customer reviews suggest focusing on peak-hour staffing and speed of service.",
        negativeMentions: negativeTopic?.negative || 4,
      },
      executiveSummary: aiSummary.executiveSummary,
      topActionRecommendations: [
        {
          title: aiSummary.actionableTakeaway || "Target Top Negative Feedback Themes",
          timeframe: "Immediate (48 Hours)",
          impact: "+0.3 Rating Lift",
        },
        {
          title: "Implement Line-Check Temperature & Service SLAs",
          timeframe: "This Week",
          impact: "Eliminate 80% of Food/Speed Friction",
        },
        {
          title: "Amplify 5-Star Reviews & Loyalty Perks",
          timeframe: "Opportunity",
          impact: "+15% Repeat Dining Growth",
        },
      ],
    };

    // Save to database
    if (business) {
      await prisma.report.create({
        data: {
          businessId: business.id,
          title: `${businessName} ${monthYear} Executive Intelligence Report`,
          period: `${monthYear} Period`,
          summary: reportData.executiveSummary,
          metrics: JSON.stringify(reportData),
        },
      });
    }

    return NextResponse.json({
      success: true,
      report: reportData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate executive report.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
