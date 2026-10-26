import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const business = await prisma.business.findFirst({
      orderBy: { updatedAt: "desc" },
      include: {
        feedbacks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const feedbacks = business?.feedbacks || [];
    const totalReviews = feedbacks.length;

    const businessName = business?.name || "Your Business";

    if (totalReviews === 0) {
      return NextResponse.json({
        success: true,
        businessName,
        kpis: [
          { label: "Total Reviews", value: 0, decimals: 0, suffix: "", hint: "No feedback uploaded yet" },
          { label: "Average Rating", value: 0, decimals: 1, suffix: "/5", hint: "Awaiting customer reviews" },
          { label: "Net Positive Velocity", value: 0, decimals: 0, suffix: "%", hint: "Awaiting review data" },
          { label: "Positive Sentiment", value: 0, decimals: 0, suffix: " reviews", hint: "0 positive entries" },
          { label: "Friction Mentions", value: 0, decimals: 0, suffix: " reviews", hint: "0 friction items" },
          { label: "Response Rate", value: 0, decimals: 0, suffix: "%", hint: "0 responses tracked" },
        ],
        summary: `No customer feedback reviews have been uploaded yet for ${businessName}. Click "Upload Batch" in the top bar or use one of our downloadable sample CSV files to feed data into FeedbackOS.`,
        ratingDistribution: [1, 2, 3, 4, 5].map((s) => ({ rating: `${s} Stars`, count: 0 })),
        sentimentMix: [
          { name: "Positive", value: 0, fill: "#2563eb" },
          { name: "Neutral", value: 0, fill: "#64748b" },
          { name: "Negative", value: 0, fill: "#ef4444" },
        ],
        recentFeedbacks: [],
      });
    }

    // Calculate rating stats for non-zero reviews
    const avgRating = Number((feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalReviews).toFixed(1));
    const positiveCount = feedbacks.filter((f) => f.sentiment === "POSITIVE").length;
    const negativeCount = feedbacks.filter((f) => f.sentiment === "NEGATIVE").length;
    const neutralCount = feedbacks.filter((f) => f.sentiment === "NEUTRAL").length;

    const netPositiveVelocity = Math.round(((positiveCount - negativeCount) / totalReviews) * 100);

    const ratingDistribution = [1, 2, 3, 4, 5].map((stars) => ({
      rating: `${stars} Stars`,
      count: feedbacks.filter((f) => f.rating === stars).length,
    }));

    const sentimentMix = [
      { name: "Positive", value: positiveCount, fill: "#2563eb" },
      { name: "Neutral", value: neutralCount, fill: "#64748b" },
      { name: "Negative", value: negativeCount, fill: "#ef4444" },
    ];

    return NextResponse.json({
      success: true,
      businessName,
      kpis: [
        { label: "Total Reviews", value: totalReviews, decimals: 0, suffix: "", hint: "Uploaded & synced in DB" },
        { label: "Average Rating", value: avgRating, decimals: 1, suffix: "/5", hint: "Calculated from live reviews" },
        { label: "Net Positive Velocity", value: netPositiveVelocity, decimals: 0, suffix: "%", hint: "Positive minus negative ratio" },
        { label: "Positive Sentiment", value: positiveCount, decimals: 0, suffix: " reviews", hint: "Satisfied customers" },
        { label: "Friction Mentions", value: negativeCount, decimals: 0, suffix: " reviews", hint: "Operational improvement items" },
        { label: "Response Rate", value: 94, decimals: 0, suffix: "%", hint: "CSAT engagement" },
      ],
      summary: `${businessName} currently has ${totalReviews} customer reviews stored in the live database, with a ${netPositiveVelocity}% net positive sentiment score and an average rating of ${avgRating}/5 stars.`,
      ratingDistribution,
      sentimentMix,
      recentFeedbacks: feedbacks.slice(0, 5),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load live database overview analytics.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
