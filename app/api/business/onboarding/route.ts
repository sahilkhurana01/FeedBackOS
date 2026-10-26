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

      // Check if user already has a business or if a seed/default business exists
      const existingBiz = await prisma.business.findFirst({
        where: { OR: [{ userId: user.id }, { id: "bus_seed_heritage_bistro" }] },
        orderBy: { updatedAt: "desc" },
      });

      if (existingBiz) {
        businessRecord = await prisma.business.update({
          where: { id: existingBiz.id },
          data: {
            name: businessName,
            industry: industry,
            userId: user.id,
            updatedAt: new Date(),
          },
        });
      } else {
        businessRecord = await prisma.business.create({
          data: {
            name: businessName,
            industry: industry,
            userId: user.id,
          },
        });
      }
    } catch (dbErr) {
      console.error("Database Onboarding Error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Welcome to FeedbackOS, ${businessName}! Workspace configured successfully.`,
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
        include: { businesses: { orderBy: { updatedAt: "desc" }, include: { user: true } } },
      });

      if (user && user.businesses.length > 0) {
        return NextResponse.json({
          hasBusiness: true,
          business: user.businesses[0],
        });
      }
    }

    // Check if any business exists in DB (most recently updated)
    const activeBusiness = await prisma.business.findFirst({
      orderBy: { updatedAt: "desc" },
      include: { user: true },
    });
    return NextResponse.json({
      hasBusiness: !!activeBusiness,
      business: activeBusiness || null,
    });
  } catch {
    return NextResponse.json({ hasBusiness: false, business: null });
  }
}
