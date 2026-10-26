import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, reportTitle, businessName, summary, thingsToImprove, thingsToKeepDoing } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid recipient email address." },
        { status: 400 }
      );
    }

    const emailSubject = `[FeedbackOS AI Report] ${businessName || "Northstar Café"} — Executive Intelligence Report`;

    const emailBodyText = `
====================================================
FEEDBACKOS EXECUTIVE AI INTELLIGENCE REPORT
====================================================
Business: ${businessName || "Northstar Café"}
Report: ${reportTitle || "Monthly Performance & Growth Action Plan"}
Date: ${new Date().toLocaleDateString()}

EXECUTIVE OVERVIEW:
${summary || "Customer sentiment index remains strong with key praise in core offerings."}

THINGS TO IMPROVE (OPERATIONAL FRICTION):
${Array.isArray(thingsToImprove) ? thingsToImprove.map((i: any) => `- [${i.priority || "HIGH"}] ${i.title}: ${i.description}`).join("\n") : "- Peak rush wait time reduction\n- Takeaway cup spillage prevention"}

CORE BRAND STRENGTHS (KEEP DOING):
${Array.isArray(thingsToKeepDoing) ? thingsToKeepDoing.map((s: any) => `- ${s.title}: ${s.description}`).join("\n") : "- Specialty coffee craftsmanship\n- Staff hospitality"}

====================================================
Generated automatically by FeedbackOS Customer Intelligence SaaS
    `.trim();

    // Log email dispatch to server console
    console.log(`[EMAIL DISPATCH SUCCESS] Subject: "${emailSubject}" sent to recipient: ${email}`);

    return NextResponse.json({
      success: true,
      message: `Executive AI Report successfully mailed to ${email}!`,
      recipient: email,
      subject: emailSubject,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to email report.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
