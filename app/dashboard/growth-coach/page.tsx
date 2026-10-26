import type { Metadata } from "next";

import { ChatInterface } from "@/components/growth-coach/chat-interface";

export const metadata: Metadata = { title: "AI Growth Coach — FeedbackOS" };

export default function GrowthCoachPage() {
  return <ChatInterface />;
}
