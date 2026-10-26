import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { computeBusinessIssues } from "@/lib/priority-engine";
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
        orderBy: { updatedAt: "desc" },
        include: { feedbacks: { orderBy: { createdAt: "desc" }, take: 300 } },
      });
    }

    const feedbacks = business?.feedbacks ?? [];

    if (feedbacks.length === 0) {
      return NextResponse.json({ success: true, count: 0, issues: [] });
    }

    const dbFeedbacks = feedbacks.map((f) => ({
      content: f.content,
      rating: f.rating,
      sentiment: f.sentiment,
    }));

    const issues = computeBusinessIssues(dbFeedbacks);

    // Shape for frontend consumption
    const shaped = issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      category: issue.category,
      priority: issue.priority,
      mentions: issue.mentions,
      trend: issue.trend,
      impactScore: issue.impactScore,
      exampleFeedback: issue.exampleFeedback,
      recommendedAction: issue.recommendedAction,
    }));

    return NextResponse.json({
      success: true,
      count: shaped.length,
      criticalCount: shaped.filter((i) => i.priority === "CRITICAL").length,
      highCount: shaped.filter((i) => i.priority === "HIGH").length,
      issues: shaped,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to compute business priority issues.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
