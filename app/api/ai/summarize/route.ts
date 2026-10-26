import { NextResponse } from "next/server";
import { generateAISummary } from "@/lib/groq-client";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let reviews = body.reviews || [];

    const business = await prisma.business.findFirst();
    const businessName = body.businessName || business?.name || "Your Business";

    if (!reviews || reviews.length === 0) {
      try {
        reviews = await prisma.feedback.findMany({
          take: 30,
          orderBy: { createdAt: "desc" },
          select: { content: true, rating: true, sentiment: true },
        });
      } catch {
        reviews = [];
      }
    }

    const summary = await generateAISummary(reviews, businessName);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate AI executive summary.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
