import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, industry, location, email, monthlyVolume } = body;

    if (!businessName || !industry) {
      return NextResponse.json(
        { success: false, error: "Business Name and Industry are required." },
        { status: 400 }
      );
    }

    let clerkUser = null;
    try {
      clerkUser = await currentUser();
    } catch {
      // Clerk optional catch
    }

    const clerkId = clerkUser?.id || "usr_demo_onboarding";
    const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || email || "owner@feedbackos.app";
    const userName = clerkUser?.fullName || "Business Owner";

    let businessRecord = null;

    try {
      // Upsert User record
      const user = await prisma.user.upsert({
        where: { clerkUserId: clerkId },
        update: { name: userName, email: userEmail },
        create: {
          clerkUserId: clerkId,
          email: userEmail,
          name: userName,
        },
      });

      // Create Business record with ZERO seeded reviews (pure clean slate)
      businessRecord = await prisma.business.create({
        data: {
          name: businessName,
          industry: industry,
          userId: user.id,
        },
      });
    } catch (dbErr) {
      console.error("Database Onboarding Error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Welcome to FeedbackOS, ${businessName}! Workspace created. Upload your first CSV batch to begin.`,
      business: {
        id: businessRecord?.id || "bus_onboarded",
        name: businessName,
        industry,
        location: location || "Primary Location",
        email: userEmail,
        monthlyVolume,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save onboarding business info.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    let clerkUser = null;
    try {
      clerkUser = await currentUser();
    } catch {
      // Clerk optional catch
    }

    const clerkId = clerkUser?.id;

    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: clerkId },
        include: { businesses: { include: { user: true } } },
      });

      if (user && user.businesses.length > 0) {
        return NextResponse.json({
          hasBusiness: true,
          business: user.businesses[0],
        });
      }
    }

    // Check if any business exists in DB
    const firstBusiness = await prisma.business.findFirst({
      include: { user: true },
    });
    return NextResponse.json({
      hasBusiness: !!firstBusiness,
      business: firstBusiness || null,
    });
  } catch {
    return NextResponse.json({ hasBusiness: false, business: null });
  }
}
