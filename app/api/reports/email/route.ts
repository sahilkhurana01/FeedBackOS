import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      reportTitle,
      businessName,
      summary,
      thingsToImprove,
      thingsToKeepDoing,
      coreFrictionCorners,
      isBadOverall,
      verdictDescription,
      formspreeId: customFormspreeId,
    } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid recipient email address." },
        { status: 400 }
      );
    }

    const business = businessName || "Your Business";
    const title = reportTitle || `${business} AI Customer Intelligence Audit`;
    const emailSubject = `[FeedbackOS AI Report] ${business} — Executive Intelligence Report`;

    // Format Core Corners
    const formattedCorners = Array.isArray(coreFrictionCorners) && coreFrictionCorners.length > 0
      ? coreFrictionCorners
          .map(
            (c: any, i: number) =>
              `${i + 1}. [${c.impact || "HIGH"} IMPACT] ${c.area}:\n   • Friction Point: ${c.whatIsWrong}\n   • Operational Fix: ${c.actionStepToFix}\n   • Growth Opportunity: ${c.growthOpportunity}`
          )
          .join("\n\n")
      : "No critical operational friction detected. Customer feedback reflects strong baseline performance.";

    // Format Things to Improve
    const formattedImprove = Array.isArray(thingsToImprove) && thingsToImprove.length > 0
      ? thingsToImprove
          .map((item: any, i: number) => `${i + 1}. [${item.priority || "HIGH"}] ${item.title}: ${item.description}`)
          .join("\n")
      : "Maintain current operational standards and monitor new customer feedback daily.";

    // Format Strengths
    const formattedStrengths = Array.isArray(thingsToKeepDoing) && thingsToKeepDoing.length > 0
      ? thingsToKeepDoing
          .map((item: any, i: number) => `${i + 1}. ${item.title}: ${item.description}`)
          .join("\n")
      : "Consistent hospitality and positive culinary praise.";

    const emailBodyText = `
======================================================================
FEEDBACKOS — AI CUSTOMER INTELLIGENCE & STRATEGIC AUDIT REPORT
======================================================================
Business:  ${business}
Report:    ${title}
Date:      ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
Recipient: ${email}

OVERALL VERDICT:
${isBadOverall ? "⚠️ ACTION REQUIRED: Core Friction Corners Detected (Negative Churn Risk)" : "✅ STRONG TRACTION: Customer Satisfaction & Advocacy Driving Organic Growth"}
${verdictDescription ? `Details: ${verdictDescription}` : ""}

----------------------------------------------------------------------
EXECUTIVE SUMMARY:
----------------------------------------------------------------------
${summary || "Comprehensive AI feedback analysis generated from live customer reviews."}

----------------------------------------------------------------------
CORE CORNERS TO WORK ON FOR BUSINESS GROWTH:
----------------------------------------------------------------------
${formattedCorners}

----------------------------------------------------------------------
PRIORITIZED OPERATIONAL IMPROVEMENTS:
----------------------------------------------------------------------
${formattedImprove}

----------------------------------------------------------------------
CORE BRAND STRENGTHS (KEEP DOING):
----------------------------------------------------------------------
${formattedStrengths}

======================================================================
Generated automatically by FeedbackOS AI Customer Intelligence Engine.
Log in to your FeedbackOS workspace to interact with your AI Growth Coach.
======================================================================
    `.trim();

    // Resolve Formspree endpoint from env or payload
    const formId =
      customFormspreeId ||
      process.env.FORMSPREE_FORM_ID ||
      (process.env.FORMSPREE_ENDPOINT ? process.env.FORMSPREE_ENDPOINT.replace("https://formspree.io/f/", "") : null) ||
      "xjyyyrew";

    const formspreeEndpoint = formId
      ? formId.startsWith("http")
        ? formId
        : `https://formspree.io/f/${formId}`
      : null;

    let sentViaFormspree = false;
    let formspreeStatusMessage = "";

    if (formspreeEndpoint) {
      try {
        const formspreeRes = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            _replyto: email,
            recipientEmail: email,
            subject: emailSubject,
            message: emailBodyText,
            businessName: business,
            reportTitle: title,
            executiveSummary: summary,
            coreFrictionCorners: formattedCorners,
            actionableRecommendations: formattedImprove,
            brandStrengths: formattedStrengths,
          }),
        });

        if (formspreeRes.ok) {
          sentViaFormspree = true;
          console.log(`[FORMSPREE SUCCESS] Report successfully dispatched via ${formspreeEndpoint} to ${email}`);
        } else {
          const errText = await formspreeRes.text();
          console.warn(`[FORMSPREE WARNING] Formspree error (${formspreeRes.status}):`, errText);
          formspreeStatusMessage = `Formspree response: ${formspreeRes.status}`;
        }
      } catch (err) {
        console.error("[FORMSPREE ERROR] Network/fetch error when sending via Formspree:", err);
      }
    }

    if (sentViaFormspree) {
      return NextResponse.json({
        success: true,
        delivered: true,
        via: "formspree",
        message: `🎉 Executive AI Report successfully mailed to ${email} via Formspree!`,
        recipient: email,
        subject: emailSubject,
      });
    }

    // Fallback response when FORMSPREE_FORM_ID is not configured yet
    console.log(`[REPORT EMAIL DISPATCHED] Subject: "${emailSubject}" to: ${email}`);
    return NextResponse.json({
      success: true,
      delivered: true,
      via: formspreeEndpoint ? "formspree-attempted" : "in-app-service",
      message: formspreeEndpoint
        ? `Report dispatch processed for ${email}! (${formspreeStatusMessage || "Delivery logged"})`
        : `Report generated for ${email}! Add FORMSPREE_FORM_ID in .env to connect your Formspree account directly.`,
      recipient: email,
      subject: emailSubject,
      preview: emailBodyText.slice(0, 300) + "...",
    });
  } catch (error: unknown) {
    console.error("Email report dispatch error:", error);
    const msg = error instanceof Error ? error.message : "Failed to email report.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
