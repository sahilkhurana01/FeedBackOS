import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    await prisma.coachMessage.deleteMany({});
    await prisma.coachConversation.deleteMany({});
    await prisma.report.deleteMany({});
    await prisma.recommendation.deleteMany({});
    await prisma.issue.deleteMany({});
    await prisma.topic.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.business.deleteMany({});
    await prisma.user.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "Database completely reset. All users, businesses, and reviews cleared.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Database reset failed.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
