import { NextResponse } from "next/server";
import { getActiveUserBusiness } from "@/lib/user-context";
import { runFullAIAnalysis } from "@/lib/full-analyzer-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userBus = await getActiveUserBusiness();

    const businessId = body.businessId || userBus.businessId;
    const businessName = body.businessName || userBus.businessName;

    const analysisResult = await runFullAIAnalysis(businessId, businessName);

    return NextResponse.json({
      success: true,
      userEmail: userBus.userEmail,
      analysis: analysisResult,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to run full AI analysis.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
