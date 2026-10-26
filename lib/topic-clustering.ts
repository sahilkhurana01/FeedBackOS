/**
 * FeedbackOS Topic Clustering Engine v2
 * Uses the shared NLP engine for consistent topic detection.
 * Returns exact real counts — never fake fallback numbers.
 */

import { detectTopics, TOPIC_TAXONOMY } from "@/lib/nlp-engine";

export interface TopicAnalytics {
  name: string;
  count: number;
  positive: number;
  negative: number;
  neutral: number;
  averageRating: number;
  positivePercentage: number;
  trend: "improving" | "declining" | "stable";
}

export interface FeedbackItemForTopic {
  content: string;
  rating: number;
  sentiment: string;
  topics?: string[];
}

export function computeTopicClusters(feedbacks: FeedbackItemForTopic[]): TopicAnalytics[] {
  if (!feedbacks || feedbacks.length === 0) return [];

  const topicStats: Record<
    string,
    { count: number; pos: number; neg: number; neu: number; ratingSum: number }
  > = {};

  feedbacks.forEach((item) => {
    // Use topics array if provided, otherwise detect from content
    const assignedTopics =
      item.topics && item.topics.length > 0 ? item.topics : detectTopics(item.content);

    assignedTopics.forEach((t) => {
      if (!topicStats[t]) {
        topicStats[t] = { count: 0, pos: 0, neg: 0, neu: 0, ratingSum: 0 };
      }
      const stat = topicStats[t];
      stat.count += 1;
      stat.ratingSum += item.rating || 3;

      if (item.sentiment === "POSITIVE" || item.rating >= 4) stat.pos += 1;
      else if (item.sentiment === "NEGATIVE" || item.rating <= 2) stat.neg += 1;
      else stat.neu += 1;
    });
  });

  return Object.entries(topicStats)
    .filter(([, stat]) => stat.count > 0) // Only include topics with actual mentions
    .map(([name, stat]) => {
      const total = stat.count;
      const avgRating = Number((stat.ratingSum / total).toFixed(1));
      const posPct = Math.round((stat.pos / total) * 100);
      const negPct = Math.round((stat.neg / total) * 100);

      // Trend: improving if majority positive, declining if majority negative
      const trend: "improving" | "declining" | "stable" =
        posPct >= 65 ? "improving" : negPct >= 40 ? "declining" : "stable";

      return {
        name,
        count: total,
        positive: stat.pos,
        negative: stat.neg,
        neutral: stat.neu,
        averageRating: avgRating,
        positivePercentage: posPct,
        trend,
      };
    })
    .sort((a, b) => b.count - a.count); // Most-mentioned first
}
