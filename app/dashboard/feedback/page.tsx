import type { Metadata } from "next";

import { FeedbackExplorer } from "@/components/feedback/feedback-explorer";

export const metadata: Metadata = { title: "Feedback Explorer — FeedbackOS" };

export default function FeedbackPage() {
  return <FeedbackExplorer />;
}
