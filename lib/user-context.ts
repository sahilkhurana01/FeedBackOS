import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface ActiveUserBusiness {
  userId: string;
  userEmail: string;
  userName: string;
  businessId: string;
  businessName: string;
  industry: string;
}

export async function getActiveUserBusiness(): Promise<ActiveUserBusiness> {
  let clerkId = "usr_demo_default";
  let userEmail = "admin@feedbackos.io";
  let userName = "Business Administrator";

  try {
    const user = await currentUser();
    if (user) {
      clerkId = user.id;
      userEmail = user.emailAddresses?.[0]?.emailAddress || userEmail;
      userName = user.fullName || userName;
    }
  } catch {
    // Clerk optional
  }

  // Find business for authenticated user or fallback to first business
  try {
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkId },
      include: { businesses: true },
    });

    if (dbUser && dbUser.businesses.length > 0) {
      const activeBus = dbUser.businesses[0];
      return {
        userId: dbUser.id,
        userEmail: dbUser.email || userEmail,
        userName: dbUser.name || userName,
        businessId: activeBus.id,
        businessName: activeBus.name,
        industry: activeBus.industry || "General",
      };
    }

    // Try finding any business in the database
    const anyBus = await prisma.business.findFirst({
      include: { user: true },
    });

    if (anyBus) {
      return {
        userId: anyBus.userId,
        userEmail: anyBus.user?.email || userEmail,
        userName: anyBus.user?.name || userName,
        businessId: anyBus.id,
        businessName: anyBus.name,
        industry: anyBus.industry || "General",
      };
    }
  } catch (err) {
    console.error("User context resolution error:", err);
  }

  return {
    userId: "usr_fallback",
    userEmail,
    userName,
    businessId: "bus_fallback",
    businessName: "The Heritage Bistro & Kitchen",
    industry: "Restaurant & Hospitality",
  };
}
