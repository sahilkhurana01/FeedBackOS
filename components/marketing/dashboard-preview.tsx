"use client";

import { Bell, Search } from "lucide-react";

import { SentimentAreaChart } from "@/components/charts/sentiment-area";
import { CountUp } from "@/components/shared/count-up";
import { Badge } from "@/components/ui/badge";
import {
  AI_SUMMARY,
  CRITICAL_ISSUES,
  DEMO_BUSINESS,
  PREVIEW_KPIS,
  TOP_TOPICS,
} from "@/lib/mock-data/landing";
import { cn } from "@/lib/utils";

const NAV = ["Overview", "Feedback", "Insights", "Issues"] as const;

export function DashboardPreview({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] bg-card shadow-elevated",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-negative/70" />
        <span className="size-2.5 rounded-full bg-gold/80" />
        <span className="size-2.5 rounded-full bg-positive/80" />
        <span className="ml-3 truncate text-xs text-muted-foreground">
          app.feedbackos.com / {DEMO_BUSINESS.name}
        </span>
      </div>

      <div className="flex min-h-0">
        <aside className="hidden w-40 shrink-0 border-r border-border bg-muted/30 p-3 sm:block">
          <p className="px-2 pb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </p>
          <ul className="space-y-0.5">
            {NAV.map((item, index) => (
              <li
                key={item}
                className={cn(
                  "rounded-lg px-2 py-1.5 text-xs",
                  index === 0
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Overview
              </p>
              <p className="text-sm font-medium">{DEMO_BUSINESS.name}</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="size-3.5" />
              <Bell className="size-3.5" />
              <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-[10px] font-medium text-primary">
                NC
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {PREVIEW_KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl bg-muted px-3 py-2.5"
              >
                <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 font-medium tracking-tight">
                  <CountUp
                    value={kpi.value}
                    decimals={kpi.label === "Average rating" ? 1 : 0}
                  />
                  {kpi.suffix}
                </p>
              </div>
            ))}
          </div>

          <div className={cn("mt-4 grid gap-3", compact ? "lg:grid-cols-1" : "lg:grid-cols-5")}>
            <div className={cn("rounded-xl bg-muted/80 p-3", compact ? "" : "lg:col-span-3")}>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-medium">Sentiment trend</p>
                <Badge variant="positive">Improving</Badge>
              </div>
              <SentimentAreaChart height={compact ? 140 : 168} />
            </div>

            {!compact ? (
              <div className="space-y-3 lg:col-span-2">
                <div className="rounded-xl bg-muted/80 p-3">
                  <p className="mb-2 text-xs font-medium">Top topics</p>
                  <ul className="space-y-2">
                    {TOP_TOPICS.map((topic) => (
                      <li key={topic.name} className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs">{topic.name}</span>
                        <Badge
                          variant={
                            topic.sentiment === "positive"
                              ? "positive"
                              : topic.sentiment === "negative"
                                ? "negative"
                                : "muted"
                          }
                        >
                          {topic.mentions}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>

          {!compact ? (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-muted/80 p-3">
                <p className="mb-2 text-xs font-medium">Critical issues</p>
                <ul className="space-y-2">
                  {CRITICAL_ISSUES.map((issue) => (
                    <li key={issue.title} className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium">{issue.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {issue.mentions} mentions · {issue.trend}
                        </p>
                      </div>
                      <Badge variant={issue.priority === "High" ? "negative" : "gold"}>
                        {issue.priority}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <p className="mb-2 text-xs font-medium">AI recommendation</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{AI_SUMMARY}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
