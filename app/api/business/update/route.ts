import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      businessName,
      industry,
      location,
      userName,
      userRole,
      userEmail,
    } = body;

    const newBizName = (name || businessName || "").trim();

    let clerkUser = null;
    try {
      clerkUser = await currentUser();
    } catch {}
    const clerkId = clerkUser?.id;

    let targetBusiness = null;

    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: clerkId },
        include: { businesses: { orderBy: { updatedAt: "desc" } } },
      });
      if (user && user.businesses.length > 0) {
        targetBusiness = user.businesses[0];
      }
    }

    if (!targetBusiness) {
      targetBusiness = await prisma.business.findFirst({
        orderBy: { updatedAt: "desc" },
        include: { user: true },
      });
    }

    if (!targetBusiness) {
      // If no business exists at all in DB, create one
      const fallbackUser = await prisma.user.create({
        data: {
          clerkUserId: clerkId || "usr_default_admin",
          email: userEmail || clerkUser?.emailAddresses?.[0]?.emailAddress || "admin@feedbackos.io",
          name: userName || "Business Owner",
          role: userRole || "OWNER",
        },
      });

      targetBusiness = await prisma.business.create({
        data: {
          name: newBizName || "My Business",
          industry: industry || "Restaurant / Dining",
          userId: fallbackUser.id,
        },
        include: { user: true },
      });

      return NextResponse.json({
        success: true,
        message: "Business created and updated successfully.",
        business: targetBusiness,
      });
    }

    // Update existing business record
    const updatedBusiness = await prisma.business.update({
      where: { id: targetBusiness.id },
      data: {
        ...(newBizName ? { name: newBizName } : {}),
        ...(industry ? { industry } : {}),
        updatedAt: new Date(),
      },
      include: { user: true },
    });

    // Update associated user record if user fields provided
    if (updatedBusiness.userId && (userName || userEmail || userRole)) {
      try {
        await prisma.user.update({
          where: { id: updatedBusiness.userId },
          data: {
            ...(userName ? { name: userName } : {}),
            ...(userEmail ? { email: userEmail } : {}),
            ...(userRole ? { role: userRole } : {}),
          },
        });
      } catch (userErr) {
        console.warn("Could not update user record:", userErr);
      }
    }

    // Fetch refreshed business with user
    const finalBusiness = await prisma.business.findUnique({
      where: { id: updatedBusiness.id },
      include: { user: true },
    });

    return NextResponse.json({
      success: true,
      message: `Business details updated to "${finalBusiness?.name}" successfully!`,
      business: finalBusiness,
    });
  } catch (error: unknown) {
    console.error("Error updating business settings:", error);
    const msg = error instanceof Error ? error.message : "Failed to update business settings.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
