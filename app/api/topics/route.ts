import { NextResponse } from "next/server";
import { computeTopicClusters } from "@/lib/topic-clustering";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let dbFeedbacks: Array<{ content: string; rating: number; sentiment: string }> = [];

    try {
      if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost:5432")) {
        dbFeedbacks = await prisma.feedback.findMany({
          take: 100,
          select: {
            content: true,
            rating: true,
            sentiment: true,
          },
        });
      }
    } catch {
      dbFeedbacks = [];
    }

    // Return empty topics if no DB records - never inject demo data
    if (dbFeedbacks.length === 0) {
      return NextResponse.json({ success: true, count: 0, topics: [] });
    }

    const clusters = computeTopicClusters(dbFeedbacks);

    return NextResponse.json({
      success: true,
      count: clusters.length,
      topics: clusters,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch topic breakdown.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
