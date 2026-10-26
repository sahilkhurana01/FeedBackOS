import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { askGrowthCoach, CoachChatMessage } from "@/lib/coach-agent";
import { prisma } from "@/lib/prisma";
import { detectTopics } from "@/lib/nlp-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message: string = body.message || "";
    const history: CoachChatMessage[] = body.history || [];
    const businessName: string = body.businessName || "Your Business";

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // ── Load live business context from database ──────────────────────────────
    let businessContext: Parameters<typeof askGrowthCoach>[3] | undefined;

    try {
      let clerkUser = null;
      try { clerkUser = await currentUser(); } catch {}
      const clerkId = clerkUser?.id;

      let business = null;
      if (clerkId) {
        const user = await prisma.user.findUnique({
          where: { clerkUserId: clerkId },
          include: {
            businesses: {
              include: {
                feedbacks: { orderBy: { createdAt: "desc" }, take: 200 },
              },
            },
          },
        });
        business = user?.businesses?.[0] ?? null;
      }

      if (!business) {
        business = await prisma.business.findFirst({
          orderBy: { updatedAt: "desc" },
          include: { feedbacks: { orderBy: { createdAt: "desc" }, take: 200 } },
        });
      }

      if (business && business.feedbacks.length > 0) {
        const feedbacks = business.feedbacks;
        const total = feedbacks.length;
        const posCount = feedbacks.filter((f) => f.sentiment === "POSITIVE").length;
        const negCount = feedbacks.filter((f) => f.sentiment === "NEGATIVE").length;
        const avgRating = feedbacks.reduce((s, f) => s + f.rating, 0) / total;

        // Compute top issue topics (most negative)
        const negTopicCounts: Record<string, number> = {};
        const posTopicCounts: Record<string, number> = {};

        feedbacks.forEach((f) => {
          const topics = detectTopics(f.content);
          topics.forEach((t) => {
            if (f.sentiment === "NEGATIVE" || f.rating <= 2) {
              negTopicCounts[t] = (negTopicCounts[t] ?? 0) + 1;
            }
            if (f.sentiment === "POSITIVE" || f.rating >= 4) {
              posTopicCounts[t] = (posTopicCounts[t] ?? 0) + 1;
            }
          });
        });

        const topIssues = Object.entries(negTopicCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([t]) => t);

        const topStrengths = Object.entries(posTopicCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([t]) => t);

        const recentNegativeQuotes = feedbacks
          .filter((f) => f.sentiment === "NEGATIVE" || f.rating <= 2)
          .slice(0, 5)
          .map((f) => f.content.slice(0, 120) + (f.content.length > 120 ? "..." : ""));

        businessContext = {
          totalReviews: total,
          avgRating,
          positivePct: Math.round((posCount / total) * 100),
          negativePct: Math.round((negCount / total) * 100),
          topIssues,
          topStrengths,
          recentNegativeQuotes,
        };
      }
    } catch (dbErr) {
      console.error("Coach DB context error:", dbErr);
      // Continue without context — coach will still respond
    }

    const coachResponse = await askGrowthCoach(
      message.trim(),
      history,
      businessName,
      businessContext
    );

    return NextResponse.json({
      success: true,
      reply: coachResponse.message,
      suggestedAction: coachResponse.suggestedAction,
      source: coachResponse.source,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to execute AI Growth Coach.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
