import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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

    if (!business) {
      return NextResponse.json({ success: true, reports: [] });
    }

    const dbReports = await prisma.report.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    const reports = dbReports.map((r) => {
      let metrics: any = {};
      try {
        if (typeof r.metrics === "string") {
          metrics = JSON.parse(r.metrics);
        } else if (r.metrics) {
          metrics = r.metrics;
        }
      } catch {}

      // Compute normalized 0-100 Customer Sentiment Index
      let sentimentScore = 50;
      if (typeof metrics.sentimentScore === "number" && metrics.sentimentScore > 0) {
        sentimentScore = metrics.sentimentScore;
      } else if (typeof metrics.netSentimentScore === "number") {
        // Net sentiment (-100 to +100) maps to 0-100: (0 net sentiment = 50/100 balanced baseline)
        sentimentScore = Math.max(5, Math.min(99, Math.round(50 + (metrics.netSentimentScore / 2))));
      } else if (metrics.totalFeedbackCount && metrics.badCount !== undefined) {
        const pos = metrics.excellentCount || (metrics.totalFeedbackCount - metrics.badCount);
        sentimentScore = Math.round((pos / metrics.totalFeedbackCount) * 100);
      }

      return {
        id: r.id,
        title: r.title,
        period: r.period,
        type: "Monthly Summary",
        createdAt: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        summary: r.summary,
        sentimentScore,
        totalReviewsAnalyzed: metrics.totalFeedbackCount ?? metrics.totalReviews ?? 0,
        topPositiveTopic: metrics.positiveDriver?.title || metrics.topPositiveTopic || "Product Quality",
        topNegativeTopic: metrics.frictionCluster?.title || metrics.topNegativeTopic || "Service Speed",
        status: "Ready",
      };
    });

    return NextResponse.json({ success: true, reports });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch reports";
    return NextResponse.json({ success: false, error: msg, reports: [] }, { status: 500 });
  }
}
