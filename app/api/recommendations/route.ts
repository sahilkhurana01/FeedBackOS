import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { computeActionRecommendations } from "@/lib/recommendations-engine";
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
        include: {
          businesses: {
            include: { feedbacks: { orderBy: { createdAt: "desc" }, take: 300 } },
          },
        },
      });
      business = user?.businesses?.[0] ?? null;
    }

    if (!business) {
      business = await prisma.business.findFirst({
        include: { feedbacks: { orderBy: { createdAt: "desc" }, take: 300 } },
      });
    }

    const feedbacks = business?.feedbacks ?? [];

    if (feedbacks.length === 0) {
      return NextResponse.json({ success: true, count: 0, recommendations: [] });
    }

    const dbFeedbacks = feedbacks.map((f) => ({
      content: f.content,
      rating: f.rating,
      sentiment: f.sentiment,
    }));

    const recommendations = computeActionRecommendations(dbFeedbacks);

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      immediateCount: recommendations.filter((r) => r.category === "Immediate Actions").length,
      recommendations,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to compute action recommendations.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
