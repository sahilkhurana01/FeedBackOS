import type { Metadata } from "next";

import { IssuesView } from "@/components/issues/issues-view";

export const metadata: Metadata = { title: "Issues — FeedbackOS" };

export default function IssuesPage() {
  return <IssuesView />;
}
