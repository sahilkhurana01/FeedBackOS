/**
 * FeedbackOS AI Growth Coach
 * LLM-powered conversational coach with live database business context injection.
 * Provides data-backed, actionable growth advisory based on real customer feedback.
 */

export interface CoachChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CoachResponse {
  message: string;
  suggestedAction?: string;
  source: string;
}

const PRIMARY_MODEL = "openai/gpt-oss-120b";
const FALLBACK_MODEL = "openai/gpt-oss-20b";

export async function askGrowthCoach(
  userMessage: string,
  history: CoachChatMessage[] = [],
  businessName = "Your Business",
  businessContext?: {
    totalReviews: number;
    avgRating: number;
    positivePct: number;
    negativePct: number;
    topIssues: string[];
    topStrengths: string[];
    recentNegativeQuotes: string[];
  }
): Promise<CoachResponse> {
  const apiKey = process.env.GROQ_API_KEY;

  if (apiKey && apiKey.startsWith("gsk_")) {
    const ctx = businessContext;
    const contextBlock = ctx
      ? `
LIVE BUSINESS DATA FOR ${businessName.toUpperCase()}:
- Total reviews in database: ${ctx.totalReviews}
- Average rating: ${ctx.avgRating.toFixed(1)}/5
- Positive sentiment: ${ctx.positivePct}%
- Negative sentiment: ${ctx.negativePct}%
- Top customer pain points: ${ctx.topIssues.length > 0 ? ctx.topIssues.join(", ") : "None detected yet"}
- Top customer strengths: ${ctx.topStrengths.length > 0 ? ctx.topStrengths.join(", ") : "Not yet computed"}
${ctx.recentNegativeQuotes.length > 0 ? `- Recent negative feedback samples:\n${ctx.recentNegativeQuotes.slice(0, 5).map((q, i) => `  ${i + 1}. "${q}"`).join("\n")}` : ""}
`
      : `Business: ${businessName}. No review data loaded yet.`;

    const systemPrompt = `You are the AI Growth Coach for FeedbackOS — the premier Customer Intelligence & Strategic Turnaround Platform.

${contextBlock}

YOUR EXPERT ROLE:
- You are an elite strategic growth consultant with specialized expertise in operational turnaround, guest retention, and revenue expansion.
- Answer questions SPECIFICALLY about ${businessName}'s real customer data provided above.
- If customer feedback is negative or shows friction, clearly identify the exact core corners (e.g. food quality, service pace, hygiene, staff attitudes) that are hurting growth, and give specific operational solutions.
- Format responses clearly with bold section headers, concise bullet points, and realistic impact projections (e.g., "+0.4★ lift within 3 weeks, +15% repeat visit rate").
- Proactively guide the owner on what immediate decision to make today.
- Tone: High-caliber executive advisory — actionable, rigorous, supportive, and data-backed.
- Never give generic platitudes like "make customers happy" — give concrete operational playbooks.`;

    const messagesPayload = [
      { role: "system", content: systemPrompt },
      ...history.slice(-8).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: userMessage },
    ];

    const models = [PRIMARY_MODEL, FALLBACK_MODEL];

    for (const model of models) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: messagesPayload,
            temperature: 0.35,
            max_tokens: 700,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const responseText = data.choices?.[0]?.message?.content;
          if (responseText) {
            return {
              message: responseText.trim(),
              suggestedAction: "Implement recommended changes in Action Center",
              source: "FeedbackOS AI Growth Coach",
            };
          }
        }
      } catch (err) {
        console.error(`AI Growth Coach model ${model} error:`, err);
      }
    }
  }

  // Contextual fallback from real numbers
  const ctx = businessContext;
  const queryLower = userMessage.toLowerCase();

  if (!ctx || ctx.totalReviews === 0) {
    return {
      message: `I don't have any review data for **${businessName}** yet.\n\nTo get started:\n1. **Upload a CSV** of customer reviews using the "Upload Batch" button in the top bar\n2. Use the included sample restaurant dataset\n3. Once uploaded, I'll analyze every friction point and build a custom growth plan for you.`,
      suggestedAction: "Upload customer feedback CSV",
      source: "FeedbackOS AI Growth Coach",
    };
  }

  const topIssue = ctx.topIssues[0] || "service turnaround";
  const topStrength = ctx.topStrengths[0] || "product excellence";

  if (queryLower.includes("pain point") || queryLower.includes("problem") || queryLower.includes("issue") || queryLower.includes("improve") || queryLower.includes("bad") || queryLower.includes("rating")) {
    return {
      message: `### Strategic Diagnosis for ${businessName}\n\nBased on **${ctx.totalReviews} customer reviews** (${ctx.avgRating.toFixed(1)}★ average | ${ctx.positivePct}% positive | ${ctx.negativePct}% friction rate):\n\n**#1 Critical Corner to Overhaul: ${topIssue}**\n1. **Root-Cause Elimination:** Audit current peak-hour procedures and assign clear shift ownership.\n2. **Staff Retraining:** Standardize guest interactions with an immediate hospitality briefing.\n3. **Active Recovery:** Respond to all reviews rated ≤2 stars within 12 hours with a sincere resolution.\n\n**Projected Growth Impact:** Resolving this primary friction corner will eliminate the top driver of churn and elevate your rating to **${Math.min(5, (ctx.avgRating + 0.4)).toFixed(1)}★**, restoring an estimated +15% to +20% in repeat bookings.`,
      suggestedAction: "Open Issues Page",
      source: "FeedbackOS AI Growth Coach",
    };
  }

  if (queryLower.includes("strength") || queryLower.includes("good") || queryLower.includes("positive") || queryLower.includes("love")) {
    return {
      message: `### Core Brand Assets for ${businessName}\n\nFrom your live review dataset of **${ctx.totalReviews} entries**:\n\n- **${ctx.positivePct}% Positive Loyalty:** Customers consistently celebrate **${topStrength}**.\n- **Signature Reputation:** Strong praise creates an organic competitive moat.\n\n**Growth Directive to Scale:**\n1. Showcase your 5-star testimonials on your storefront and social channels.\n2. Incentivize staff members who are repeatedly named in positive feedback.\n3. Implement a referral loyalty program to turn enthusiastic diners into brand ambassadors.`,
      suggestedAction: "Review Top Brand Strengths",
      source: "FeedbackOS AI Growth Coach",
    };
  }

  return {
    message: `### Executive Growth Summary for ${businessName}\n\n- **Analyzed Reviews:** ${ctx.totalReviews} customer entries\n- **Average Rating:** ${ctx.avgRating.toFixed(1)}★\n- **Sentiment Velocity:** ${ctx.positivePct}% Positive | ${ctx.negativePct}% Friction\n\n**Immediate Operational Priorities:**\n1. Resolve **${topIssue}** — your highest frequency friction driver.\n2. Leverage **${topStrength}** in your marketing to drive new acquisition.\n3. Execute the daily checklist in the Action Center to sustain rating momentum.\n\n*What specific department or challenge would you like to drill down into today?*`,
    suggestedAction: "Explore Action Center Directives",
    source: "FeedbackOS AI Growth Coach",
  };
}
