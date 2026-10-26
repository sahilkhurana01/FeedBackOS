import { NextResponse } from "next/server";
import { analyzeFeedbackWithNLP, ReviewInput } from "@/lib/nlp-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reviews: ReviewInput[] = body.reviews || [];

    if (!reviews || reviews.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing or empty 'reviews' array in request body." },
        { status: 400 }
      );
    }

    const nlpResult = await analyzeFeedbackWithNLP(reviews, body.businessName || "Demo Business");

    return NextResponse.json({
      success: true,
      data: nlpResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to execute sentiment analysis.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
