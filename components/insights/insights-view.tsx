"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, BarChart3, Layers, ShieldCheck, Loader2 } from "lucide-react";

import { ChartCard } from "@/components/dashboard/chart-card";
import { SentimentTrendChart } from "@/components/charts/sentiment-trend";
import { SentimentDonutChart } from "@/components/charts/sentiment-donut";
import { TopicBarChart } from "@/components/charts/topic-bar";
import { VolumeAreaChart } from "@/components/charts/volume-area";

type InsightsSummary = {
  total: number;
  topPositive: { name: string; mentionCount: number; positivePct: number } | null;
  topNegative: { name: string; mentionCount: number; negativePct: number } | null;
};

export function InsightsView() {
  const [summary, setSummary] = useState<InsightsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => {
        setSummary({
          total: d.total ?? 0,
          topPositive: d.topPositive ?? null,
          topNegative: d.topNegative ?? null,
        });
      })
      .catch(() => {
        setSummary({ total: 0, topPositive: null, topNegative: null });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">Customer Intelligence Insights</h1>
        </div>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Deep-dive sentiment trends, topic distribution, and channel feedback volume — all from your live data.
        </p>
      </div>

      {/* Highlights Banner */}
      {loading ? (
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading live insights...
        </div>
      ) : summary && summary.total === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-muted/40 p-6 text-center dark:border-white/10">
          <p className="text-[14px] font-medium text-muted-foreground">No insights yet</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Upload a CSV of customer reviews to generate live intelligence insights.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Top Positive */}
          <div className="rounded-2xl border border-black/5 bg-background p-5 shadow-xs dark:border-white/10">
            <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <TrendingUp className="size-4 text-emerald-600" />
              Top Positive Driver
            </div>
            {summary?.topPositive ? (
              <>
                <p className="mt-2 text-xl font-semibold text-foreground">{summary.topPositive.name}</p>
                <p className="text-[12px] text-emerald-600 dark:text-emerald-400 mt-1">
                  {summary.topPositive.positivePct}% positive sentiment across {summary.topPositive.mentionCount} reviews
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-xl font-semibold text-foreground">—</p>
                <p className="text-[12px] text-muted-foreground mt-1">Not enough data</p>
              </>
            )}
          </div>

          {/* Top Friction */}
          <div className="rounded-2xl border border-black/5 bg-background p-5 shadow-xs dark:border-white/10">
            <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <Layers className="size-4 text-red-600" />
              Top Friction Cluster
            </div>
            {summary?.topNegative ? (
              <>
                <p className="mt-2 text-xl font-semibold text-foreground">{summary.topNegative.name}</p>
                <p className="text-[12px] text-red-600 dark:text-red-400 mt-1">
                  {summary.topNegative.mentionCount} mentions ({summary.topNegative.negativePct}% negative rating impact)
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-xl font-semibold text-foreground">—</p>
                <p className="text-[12px] text-muted-foreground mt-1">No friction clusters yet</p>
              </>
            )}
          </div>

          {/* Total Reviews */}
          <div className="rounded-2xl border border-black/5 bg-background p-5 shadow-xs dark:border-white/10">
            <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <ShieldCheck className="size-4 text-blue-600" />
              Total Reviews Analyzed
            </div>
            <p className="mt-2 text-xl font-semibold text-foreground">{summary?.total ?? 0} Reviews</p>
            <p className="text-[12px] text-muted-foreground mt-1">Live count from your database</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-5">
        <ChartCard
          className="lg:col-span-3"
          title="Sentiment Velocity (6-Week Trend)"
          question="Is overall customer sentiment trending upward?"
          delay={0.06}
        >
          <SentimentTrendChart />
        </ChartCard>
        <ChartCard
          className="lg:col-span-2"
          title="Overall Sentiment Breakdown"
          question="How do positive, neutral, and negative reviews compare?"
          delay={0.1}
        >
          <SentimentDonutChart />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Topic Mention Density"
          question="Which operational areas spark the most conversation?"
          delay={0.08}
        >
          <TopicBarChart />
        </ChartCard>
        <ChartCard
          title="Feedback Volume Over Time"
          question="When do review influxes reach peak concentration?"
          delay={0.12}
        >
          <VolumeAreaChart />
        </ChartCard>
      </div>
    </div>
  );
}
