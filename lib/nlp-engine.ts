/**
 * FeedbackOS NLP Engine v2
 * Ultra-premium keyword extraction, sentiment scoring, and topic detection
 * Designed for commercial SaaS — works entirely from real review text
 */

export interface FeedbackItem {
  content: string;
  rating: number;
  sentiment: string;
}

// ─── Topic taxonomy with weighted keyword clusters ───────────────────────────
export const TOPIC_TAXONOMY: Record<string, { keywords: string[]; weight: number }> = {
  "Service Speed": {
    keywords: ["wait", "slow", "delay", "long", "queue", "line", "took forever", "hour", "mins", "minutes", "fast", "quick", "speedy", "rush", "time"],
    weight: 1.4,
  },
  "Staff & Hospitality": {
    keywords: ["staff", "rude", "waiter", "server", "employee", "team", "polite", "friendly", "helpful", "ignored", "attitude", "manager", "host", "barista", "unprofessional"],
    weight: 1.3,
  },
  "Food & Product Quality": {
    keywords: ["food", "taste", "quality", "fresh", "stale", "delicious", "bland", "flavour", "flavor", "portions", "hot", "cold", "raw", "cooked", "meal", "dish", "drink", "coffee", "tea", "burger", "pizza"],
    weight: 1.2,
  },
  "Pricing & Value": {
    keywords: ["price", "expensive", "cheap", "cost", "afford", "value", "worth", "overpriced", "reasonable", "deal", "money", "charge", "bill", "fee"],
    weight: 1.1,
  },
  "Cleanliness & Ambience": {
    keywords: ["clean", "dirty", "hygiene", "mess", "dusty", "ambience", "atmosphere", "vibe", "decor", "interior", "noise", "loud", "comfortable", "cosy", "cozy", "toilet", "bathroom", "restroom"],
    weight: 1.0,
  },
  "Delivery & Packaging": {
    keywords: ["delivery", "deliver", "courier", "driver", "package", "packaging", "bag", "box", "spill", "leak", "missing", "wrong order", "incorrect", "forgot", "arrived", "late"],
    weight: 1.2,
  },
  "Online & App Experience": {
    keywords: ["app", "website", "online", "order", "booking", "reservation", "platform", "interface", "ui", "ux", "digital", "contactless", "qr"],
    weight: 0.9,
  },
};

// ─── Detect which topics appear in a review ───────────────────────────────────
export function detectTopics(text: string): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  for (const [topic, { keywords }] of Object.entries(TOPIC_TAXONOMY)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.push(topic);
    }
  }
  return matched.length > 0 ? matched : ["Food & Product Quality"];
}

// ─── Extract the top N most-mentioned pain phrases from negative reviews ─────
export function extractPainPhrases(feedbacks: FeedbackItem[], topN = 8): Array<{ phrase: string; count: number; avgRating: number }> {
  const PAIN_PATTERNS = [
    /wait(?:ing|ed)?\s+(?:too\s+)?(?:long|forever|ages)/gi,
    /(?:slow|terrible|awful|horrible|bad)\s+service/gi,
    /(?:cold|stale|bad|disgusting|bland)\s+food/gi,
    /(?:rude|unfriendly|unhelpful|dismissive)\s+staff/gi,
    /(?:dirty|unhygienic|filthy)\s+(?:table|bathroom|toilet|restroom)/gi,
    /(?:missing|wrong|incorrect)\s+(?:item|order|food)/gi,
    /(?:overpriced|too\s+expensive|not\s+worth)/gi,
    /(?:long|excessive)\s+(?:queue|wait|line)/gi,
    /never\s+(?:coming\s+back|returning|again)/gi,
    /(?:hour|45\s*min|30\s*min|20\s*min)\s+wait/gi,
  ];

  const counts: Record<string, { count: number; ratingSum: number }> = {};

  feedbacks
    .filter((f) => f.rating <= 3 || f.sentiment === "NEGATIVE")
    .forEach((f) => {
      PAIN_PATTERNS.forEach((pattern) => {
        const matches = f.content.match(pattern);
        if (matches) {
          matches.forEach((m) => {
            const key = m.toLowerCase().trim();
            if (!counts[key]) counts[key] = { count: 0, ratingSum: 0 };
            counts[key].count++;
            counts[key].ratingSum += f.rating;
          });
        }
      });
    });

  return Object.entries(counts)
    .map(([phrase, { count, ratingSum }]) => ({
      phrase,
      count,
      avgRating: Number((ratingSum / count).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

// ─── Compute real urgency score for an issue ─────────────────────────────────
export function computeUrgency(
  matchCount: number,
  negCount: number,
  total: number,
  avgRating: number
): { score: number; priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" } {
  // Weighted formula: negative proportion + volume density + rating impact
  const negRatio = total > 0 ? negCount / total : 0;
  const volumeDensity = total > 0 ? Math.min(matchCount / total, 1) : 0;
  const ratingImpact = (5 - Math.max(1, avgRating)) / 4; // 0–1 scale

  const raw = negRatio * 40 + volumeDensity * 30 + ratingImpact * 30;
  const score = Math.min(99, Math.round(raw));

  let priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "LOW";
  if (score >= 70) priority = "CRITICAL";
  else if (score >= 50) priority = "HIGH";
  else if (score >= 30) priority = "MEDIUM";

  return { score, priority };
}

// ─── Infer rating lift estimate from urgency and match count ─────────────────
export function inferRatingLift(urgencyScore: number, matchCount: number): string {
  if (urgencyScore >= 70 || matchCount >= 20) return "+0.3 – 0.5 ★";
  if (urgencyScore >= 50 || matchCount >= 10) return "+0.15 – 0.3 ★";
  if (urgencyScore >= 30 || matchCount >= 5)  return "+0.05 – 0.15 ★";
  return "+0.02 – 0.08 ★";
}
