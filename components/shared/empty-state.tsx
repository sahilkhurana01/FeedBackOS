"use client";

import type { ReactNode } from "react";
import { FolderOpen, MessageSquare, AlertCircle, Sparkles, FileText, Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-background p-12 text-center shadow-xs dark:border-white/15">
      <div className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground mb-4">
        {icon || <FolderOpen className="size-6" />}
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">{description}</p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            <Button onClick={onAction} className="gap-2">
              <Plus className="size-4" />
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export const EMPTY_PRESETS = {
  feedback: {
    icon: <MessageSquare className="size-6 text-primary" />,
    title: "No feedback uploaded yet",
    description: "Upload your first batch of customer reviews or connect Google/Zomato feeds to turn feedback into growth actions.",
    actionLabel: "Upload Feedback Batch",
  },
  issues: {
    icon: <AlertCircle className="size-6 text-emerald-600" />,
    title: "No critical issues detected",
    description: "Your customer sentiment is running smoothly with no recurring high-priority complaints right now.",
    actionLabel: "View Sentiment Insights",
  },
  recommendations: {
    icon: <Sparkles className="size-6 text-primary" />,
    title: "No pending recommendations",
    description: "All recommended operational directives have been completed or resolved for this review cycle.",
    actionLabel: "Generate New Audit",
  },
  reports: {
    icon: <FileText className="size-6 text-primary" />,
    title: "No reports generated yet",
    description: "Create your first monthly executive digest or weekly operational snapshot to share with stakeholders.",
    actionLabel: "Generate Executive Report",
  },
  growthCoach: {
    icon: <Bot className="size-6 text-primary" />,
    title: "No AI conversations started",
    description: "Ask your AI Growth Coach anything about guest sentiment, staffing bottlenecks, or menu performance.",
    actionLabel: "Ask a Question",
  },
};
