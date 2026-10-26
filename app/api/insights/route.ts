import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { computeTopicClusters } from "@/lib/topic-clustering";

export async function GET() {
  try {
    let clerkUser = null;
    try { clerkUser = await currentUser(); } catch {}
    const clerkId = clerkUser?.id;

    let business = null;
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: clerkId },
        include: { businesses: { include: { feedbacks: { orderBy: { createdAt: "desc" } } } } },
      });
      business = user?.businesses?.[0] ?? null;
    }
    if (!business) {
      business = await prisma.business.findFirst({
        include: { feedbacks: { orderBy: { createdAt: "desc" } } },
      });
    }

    const feedbacks = business?.feedbacks ?? [];
    const total = feedbacks.length;

    if (total === 0) {
      return NextResponse.json({
        success: true,
        total: 0,
        topPositive: null,
        topNegative: null,
        sentimentTrend: [],
        sentimentDistribution: [
          { name: "Positive", value: 0, fill: "#0071e3" },
          { name: "Neutral", value: 0, fill: "#86868b" },
          { name: "Negative", value: 0, fill: "#d70015" },
        ],
        topicFrequency: [],
        feedbackVolume: [],
      });
    }

    const positiveCount = feedbacks.filter((f) => f.sentiment === "POSITIVE").length;
    const negativeCount = feedbacks.filter((f) => f.sentiment === "NEGATIVE").length;
    const neutralCount = feedbacks.filter((f) => f.sentiment === "NEUTRAL").length;

    const positivePct = Math.round((positiveCount / total) * 100);
    const negativePct = Math.round((negativeCount / total) * 100);
    const neutralPct = 100 - positivePct - negativePct;

    // Compute topic clusters from real data
    const rawForClustering = feedbacks.map((f) => ({
      content: f.content,
      rating: f.rating,
      sentiment: f.sentiment,
    }));
    const topics = computeTopicClusters(rawForClustering);

    // Top positive topic (highest positive percentage with enough mentions)
    const posTopics = topics
      .filter((t) => t.positivePercentage > 50 && t.count > 0)
      .sort((a, b) => b.count - a.count);
    const topPositive = posTopics[0] ?? null;

    // Top negative / friction topic (most negative mentions)
    const negTopics = topics
      .filter((t) => t.negative > 0)
      .sort((a, b) => b.negative - a.negative);
    const topNegative = negTopics[0] ?? null;

    // Build weekly sentiment trend (group by week index from latest)
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const sentimentTrend = [6, 5, 4, 3, 2, 1].map((weeksAgo) => {
      const start = now - weeksAgo * weekMs;
      const end = now - (weeksAgo - 1) * weekMs;
      const week = feedbacks.filter((f) => {
        const t = new Date(f.createdAt).getTime();
        return t >= start && t < end;
      });
      const wTotal = week.length || 1;
      const wPos = Math.round((week.filter((f) => f.sentiment === "POSITIVE").length / wTotal) * 100);
      const wNeg = Math.round((week.filter((f) => f.sentiment === "NEGATIVE").length / wTotal) * 100);
      const wNeu = 100 - wPos - wNeg;
      return {
        week: `W${7 - weeksAgo}`,
        positive: week.length > 0 ? wPos : 0,
        negative: week.length > 0 ? wNeg : 0,
        neutral: week.length > 0 ? wNeu : 0,
      };
    });

    // Build feedback volume by day (last 12 distinct days)
    const dayMap = new Map<string, number>();
    feedbacks.forEach((f) => {
      const d = new Date(f.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dayMap.set(d, (dayMap.get(d) ?? 0) + 1);
    });
    const feedbackVolume = Array.from(dayMap.entries())
      .slice(-12)
      .map(([day, reviews]) => ({ day, reviews }));

    return NextResponse.json({
      success: true,
      total,
      topPositive: topPositive
        ? {
            name: topPositive.name,
            mentionCount: topPositive.count,
            positivePct: Math.round(topPositive.positivePercentage),
          }
        : null,
      topNegative: topNegative
        ? {
            name: topNegative.name,
            mentionCount: topNegative.count,
            negativePct: topNegative.count > 0 ? Math.round((topNegative.negative / topNegative.count) * 100) : 0,
          }
        : null,
      sentimentTrend,
      sentimentDistribution: [
        { name: "Positive", value: positivePct, fill: "#0071e3" },
        { name: "Neutral", value: neutralPct, fill: "#86868b" },
        { name: "Negative", value: negativePct, fill: "#d70015" },
      ],
      topicFrequency: topics.slice(0, 8).map((t) => ({ topic: t.name, mentions: t.count })),
      feedbackVolume,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load insights";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
