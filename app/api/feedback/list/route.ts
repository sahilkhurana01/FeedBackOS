import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const rating = searchParams.get("rating") || "ALL";
    const sentiment = searchParams.get("sentiment") || "ALL";

    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.content = { contains: search };
    }

    if (rating !== "ALL") {
      whereClause.rating = parseInt(rating, 10);
    }

    if (sentiment !== "ALL") {
      whereClause.sentiment = sentiment.toUpperCase();
    }

    const dbFeedbacks = await prisma.feedback.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({
      success: true,
      count: dbFeedbacks.length,
      feedbacks: dbFeedbacks.map((f) => {
        let parsedTopics: string[] = ["Quality", "Service"];
        try {
          if (f.topics) {
            const parsed = JSON.parse(f.topics);
            if (Array.isArray(parsed) && parsed.length > 0) parsedTopics = parsed;
          }
        } catch {}

        return {
          id: f.id,
          date: new Date(f.createdAt).toISOString().split("T")[0],
          source: f.source,
          rating: f.rating,
          sentiment: f.sentiment,
          text: f.content,
          author: f.authorName || "Anonymous Customer",
          priority: f.priority,
          topics: parsedTopics,
          confidence: f.confidence || 0.92,
        };
      }),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch live database feedbacks.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
