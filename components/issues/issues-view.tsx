"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, CheckCircle2, MessageSquare, ArrowUpRight, Loader2, Inbox } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type LiveIssue = {
  id: string;
  title: string;
  category: string;
  priority: string;
  mentions: number;
  trend: string;
  impactScore: string;
  exampleFeedback: string[];
  recommendedAction: string;
};

export function IssuesView() {
  const [issues, setIssues] = useState<LiveIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    fetch("/api/issues")
      .then((r) => r.json())
      .then((data) => {
        if (data.issues && data.issues.length > 0) {
          setIssues(data.issues);
          setEmpty(false);
        } else {
          setEmpty(true);
        }
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Detected Business Issues</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Recurring friction points auto-clustered by AI based on volume, severity, and negative trend.
          </p>
        </div>
        <Link href="/dashboard/recommendations">
          <Button variant="default" size="sm" className="gap-2">
            View Action Center
            <ArrowUpRight className="size-4" />
          </Button>
        </Link>
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-black/5 bg-background p-16 dark:border-white/10">
          <Loader2 className="size-8 text-primary animate-spin mb-4" />
          <p className="text-[14px] text-muted-foreground">Analyzing feedback for issues...</p>
        </div>
      )}

      {!loading && empty && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-black/5 bg-background p-16 text-center dark:border-white/10">
          <Inbox className="size-10 text-muted-foreground/40 mb-4" />
          <p className="text-[16px] font-semibold text-foreground">No issues detected</p>
          <p className="mt-1 text-[13px] text-muted-foreground max-w-sm">
            Upload customer feedback CSV to automatically detect and cluster business issues.
          </p>
        </div>
      )}

      {/* Issues Grid */}
      {!loading && !empty && (
        <div className="grid gap-6 md:grid-cols-2">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex flex-col justify-between rounded-3xl border border-black/5 bg-background p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                        {issue.category}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-[12px] font-medium text-muted-foreground">{issue.id}</span>
                    </div>
                    <h3 className="mt-1 text-xl font-semibold text-foreground">{issue.title}</h3>
                  </div>
                  <Badge variant={issue.priority === "High" || issue.priority === "CRITICAL" ? "negative" : "muted"} className="px-3 py-1 text-[12px]">
                    {issue.priority} Priority
                  </Badge>
                </div>

                {/* Stat Pill Row */}
                <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-black/5 py-3 dark:border-white/10">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Mentions</p>
                    <p className="font-semibold text-[15px] text-foreground">{issue.mentions} reviews</p>
                  </div>
                  <div className="h-6 w-px bg-black/5 dark:bg-white/10" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Trend</p>
                    <div className="flex items-center gap-1 font-semibold text-[14px]">
                      {issue.trend === "Increasing" ? (
                        <TrendingUp className="size-4 text-red-600" />
                      ) : issue.trend === "Decreasing" ? (
                        <TrendingDown className="size-4 text-emerald-600" />
                      ) : (
                        <Minus className="size-4 text-gray-500" />
                      )}
                      <span>{issue.trend}</span>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-black/5 dark:bg-white/10" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Impact</p>
                    <p className="font-semibold text-[13px] text-primary">{issue.impactScore}</p>
                  </div>
                </div>

                {/* Sample Customer Quotes */}
                {issue.exampleFeedback.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[12px] font-medium text-muted-foreground flex items-center gap-1.5">
                      <MessageSquare className="size-3.5" />
                      Representative Customer Quotes:
                    </p>
                    <div className="space-y-1.5">
                      {issue.exampleFeedback.map((quote, idx) => (
                        <p key={idx} className="rounded-xl bg-muted px-3 py-2 text-[13px] italic text-foreground">
                          "{quote}"
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Action Box */}
              <div className="mt-6 rounded-2xl bg-muted/70 p-4 border border-black/5 dark:border-white/10">
                <p className="text-[12px] font-medium text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  AI Recommended Next Step
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground font-medium">
                  {issue.recommendedAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
