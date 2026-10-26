import type { Metadata } from "next";

import { ActionCenter } from "@/components/recommendations/action-center";

export const metadata: Metadata = { title: "Recommendations — FeedbackOS" };

export default function RecommendationsPage() {
  return <ActionCenter />;
}
