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
        include: { businesses: { include: { feedbacks: { orderBy: { createdAt: "desc" }, take: 200 } } } },
      });
      business = user?.businesses?.[0] ?? null;
    }

    if (!business) {
      business = await prisma.business.findFirst({
        include: { feedbacks: { orderBy: { createdAt: "desc" }, take: 200 } },
      });
    }

    const feedbacks = business?.feedbacks ?? [];
    const total = feedbacks.length;

    if (total === 0) {
      return NextResponse.json({
        notifications: [
          {
            id: "n-empty",
            title: "No reviews yet",
            body: "Upload a CSV batch to start seeing live insights.",
            time: "Now",
          },
        ],
      });
    }

    // Build live notifications from real data
    const negatives = feedbacks.filter((f) => f.sentiment === "NEGATIVE");
    const positives = feedbacks.filter((f) => f.sentiment === "POSITIVE");
    const recent7 = feedbacks.slice(0, 50); // last 50 reviews
    const avgRating = total > 0
      ? (feedbacks.reduce((a, f) => a + f.rating, 0) / total).toFixed(1)
      : "0.0";

    const notifications = [];

    if (negatives.length > 0) {
      notifications.push({
        id: "n-neg",
        title: `${negatives.length} negative reviews detected`,
        body: `${Math.round((negatives.length / total) * 100)}% of all reviews are negative. Review the Issues page.`,
        time: "Live",
      });
    }

    if (positives.length > 0) {
      notifications.push({
        id: "n-pos",
        title: `${positives.length} positive reviews`,
        body: `Customers are happy! Average rating is ${avgRating}/5 across ${total} reviews.`,
        time: "Live",
      });
    }

    const recentNeg = recent7.filter((f) => f.sentiment === "NEGATIVE");
    if (recentNeg.length > 0) {
      notifications.push({
        id: "n-recent",
        title: `${recentNeg.length} recent friction mentions`,
        body: "Check Recommendations for AI-generated action steps.",
        time: "Recent",
      });
    }

    notifications.push({
      id: "n-summary",
      title: `${business?.name ?? "Your Business"} weekly summary`,
      body: `${total} reviews in database. ${positives.length} positive, ${negatives.length} negative.`,
      time: "Latest",
    });

    return NextResponse.json({ notifications });
  } catch {
    return NextResponse.json({
      notifications: [
        { id: "n-err", title: "Unable to load notifications", body: "Check database connection.", time: "Now" },
      ],
    });
  }
}
