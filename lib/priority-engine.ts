/**
 * FeedbackOS Priority Engine v2
 * Real-time issue detection from live customer review data.
 * Produces zero fake/random data — every field comes from actual reviews.
 */

import { TOPIC_TAXONOMY, computeUrgency, inferRatingLift, detectTopics } from "@/lib/nlp-engine";

export interface BusinessIssue {
  id: string;
  title: string;
  category: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  urgencyScore: number;
  mentions: number;
  trend: "Increasing" | "Decreasing" | "Stable";
  impactScore: string;
  exampleFeedback: string[];
  recommendedAction: string;
}

export interface RawFeedbackItem {
  content: string;
  rating: number;
  sentiment: string;
}

// Action playbooks keyed by topic — rich, specific, actionable
const ACTION_PLAYBOOK: Record<string, { action: string; title: (n: number) => string }> = {
  "Service Speed": {
    title: (n) => `Reduce Service Wait Times (${n} complaints)`,
    action:
      "Audit your current order flow for bottlenecks. Stagger shift start times so peak coverage matches demand. Pre-stage high-volume items 30 min before rush. Track order-to-dispatch times via your POS and set a hard target of ≤8 min.",
  },
  "Staff & Hospitality": {
    title: (n) => `Improve Staff Interaction Quality (${n} mentions)`,
    action:
      "Run a 15-min hospitality briefing each morning. Introduce a customer-first protocol: greet within 30 sec, check-in at the 5-min mark. Pair underperforming staff with top-rated colleagues for 2 shadow shifts.",
  },
  "Food & Product Quality": {
    title: (n) => `Fix Recurring Food Quality Issues (${n} complaints)`,
    action:
      "Identify the specific items flagged most often. Audit supplier freshness SLAs and kitchen holding times. Implement a temperature check log for every dish leaving the kitchen. Remove lowest-rated items from the menu temporarily.",
  },
  "Pricing & Value": {
    title: (n) => `Address Price-Value Perception Gap (${n} mentions)`,
    action:
      "Introduce 2–3 high-perceived-value combo meals at strategic price points. Emphasise ingredient quality and sourcing on menus and social media. Trial a loyalty punch-card for repeat visitors to improve retention without discounting core prices.",
  },
  "Cleanliness & Ambience": {
    title: (n) => `Resolve Cleanliness & Ambience Complaints (${n} reports)`,
    action:
      "Schedule hourly cleaning rotations during trading hours. Add a visible cleanliness checklist at the host station. Deep-clean bathrooms and high-touch surfaces every 2 hours. Assign a dedicated floor monitor during peak service windows.",
  },
  "Delivery & Packaging": {
    title: (n) => `Fix Delivery & Packaging Failures (${n} incidents)`,
    action:
      "Audit your packaging: switch to sealed, leak-proof containers for hot items. Cap delivery radius for temperature-sensitive products to ≤4 km. Implement a 3-point order-check before bag sealing. Add a 'packing verified by' sticker to every order.",
  },
  "Online & App Experience": {
    title: (n) => `Resolve Digital Ordering Friction (${n} reports)`,
    action:
      "Review your top 3 drop-off points in the ordering funnel. Ensure menu descriptions and photos are current. Test the full order flow weekly. Add a live chat widget or WhatsApp support for order issues.",
  },
};

export function computeBusinessIssues(feedbacks: RawFeedbackItem[]): BusinessIssue[] {
  if (!feedbacks || feedbacks.length === 0) return [];

  const total = feedbacks.length;

  // Group feedbacks by detected topic
  const topicBuckets: Record<
    string,
    { feedbacks: RawFeedbackItem[]; negative: number; ratingSum: number }
  > = {};

  feedbacks.forEach((f) => {
    const topics = detectTopics(f.content);
    topics.forEach((topic) => {
      if (!topicBuckets[topic]) {
        topicBuckets[topic] = { feedbacks: [], negative: 0, ratingSum: 0 };
      }
      topicBuckets[topic].feedbacks.push(f);
      topicBuckets[topic].ratingSum += f.rating;
      if (f.sentiment === "NEGATIVE" || f.rating <= 2) {
        topicBuckets[topic].negative++;
      }
    });
  });

  const issues: BusinessIssue[] = [];

  for (const [topic, bucket] of Object.entries(topicBuckets)) {
    const matchCount = bucket.feedbacks.length;
    const negCount = bucket.negative;
    const avgRating = matchCount > 0 ? bucket.ratingSum / matchCount : 3;

    // Only surface topics that have at least 1 negative review or low rating
    if (negCount === 0 && avgRating > 3.5) continue;

    const { score, priority } = computeUrgency(matchCount, negCount, total, avgRating);

    // Skip very-low urgency topics unless they have enough mentions
    if (score < 10 && matchCount < 3) continue;

    // Pull real negative quotes — truncate nicely
    const negFeedbacks = bucket.feedbacks
      .filter((f) => f.sentiment === "NEGATIVE" || f.rating <= 2)
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 3);

    const exampleFeedback = negFeedbacks.map((f) => {
      const text = f.content.trim();
      return text.length > 120 ? text.slice(0, 117) + "..." : text;
    });

    // Trend: compare first-half vs second-half negative rate
    const half = Math.floor(matchCount / 2);
    const firstHalf = bucket.feedbacks.slice(0, half);
    const secondHalf = bucket.feedbacks.slice(half);
    const firstNegRate = firstHalf.length > 0
      ? firstHalf.filter((f) => f.sentiment === "NEGATIVE" || f.rating <= 2).length / firstHalf.length
      : 0;
    const secondNegRate = secondHalf.length > 0
      ? secondHalf.filter((f) => f.sentiment === "NEGATIVE" || f.rating <= 2).length / secondHalf.length
      : 0;

    let trend: "Increasing" | "Decreasing" | "Stable" = "Stable";
    if (secondNegRate > firstNegRate + 0.1) trend = "Increasing";
    else if (firstNegRate > secondNegRate + 0.1) trend = "Decreasing";

    const playbook = ACTION_PLAYBOOK[topic] ?? {
      title: (n: number) => `Address ${topic} Issues (${n} mentions)`,
      action: `Review all ${topic} feedback carefully. Identify the top 3 recurring complaints and create a 7-day action plan to resolve each one.`,
    };

    issues.push({
      id: `issue_${topic.toLowerCase().replace(/[^a-z]/g, "_")}`,
      title: playbook.title(negCount > 0 ? negCount : matchCount),
      category: topic,
      priority,
      urgencyScore: score,
      mentions: matchCount,
      trend,
      impactScore: inferRatingLift(score, matchCount),
      exampleFeedback,
      recommendedAction: playbook.action,
    });
  }

  // Sort by urgency descending
  return issues.sort((a, b) => b.urgencyScore - a.urgencyScore);
}
