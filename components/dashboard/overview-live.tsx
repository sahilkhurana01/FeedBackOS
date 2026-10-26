"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Database, Sparkles } from "lucide-react";

import { RatingBarChart } from "@/components/charts/rating-bar";
import { SentimentDonutChart } from "@/components/charts/sentiment-donut";
import { SentimentTrendChart } from "@/components/charts/sentiment-trend";
import { TopicBarChart } from "@/components/charts/topic-bar";
import { VolumeAreaChart } from "@/components/charts/volume-area";
import { ChartCard } from "@/components/dashboard/chart-card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { FadeIn } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
type KpiItem = { label: string; value: number; decimals: number; suffix: string; hint: string };
type LiveIssue = { id: string; title: string; mentions: number; trend: string; priority: string };

interface OverviewData {
  businessName: string;
  kpis: KpiItem[];
  summary: string;
  ratingDistribution: Array<{ rating: string; count: number }>;
}

export function OverviewLive() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [liveIssues, setLiveIssues] = useState<LiveIssue[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setData(resData);
      })
      .catch(() => {});

    // Fetch live critical issues for the mini-list
    fetch("/api/issues")
      .then((r) => r.json())
      .then((d) => {
        if (d.issues && d.issues.length > 0) {
          setLiveIssues(d.issues.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  const businessName = data?.businessName || "Your Business";
  const kpiList = data?.kpis || [
    { label: "Total Reviews", value: 0, decimals: 0, suffix: "", hint: "No feedback uploaded yet" },
    { label: "Average Rating", value: 0, decimals: 1, suffix: "/5", hint: "Awaiting customer reviews" },
    { label: "Net Positive Velocity", value: 0, decimals: 0, suffix: "%", hint: "Awaiting review data" },
    { label: "Positive Sentiment", value: 0, decimals: 0, suffix: " reviews", hint: "0 positive entries" },
    { label: "Friction Mentions", value: 0, decimals: 0, suffix: " reviews", hint: "0 friction items" },
    { label: "Response Rate", value: 0, decimals: 0, suffix: "%", hint: "0 responses tracked" },
  ];
  const summaryText = data?.summary || "No customer feedback reviews have been uploaded yet. Click Upload Batch in the top bar to upload your CSV file or test with sample datasets.";


  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <FadeIn>
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
            <Database className="size-3.5" />
            Live Database Connected
          </span>
          <span>·</span>
          <span>{businessName}</span>
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Overview</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
          Real-time customer sentiment velocity, topic distributions, and priority friction items from your live database.
        </p>
      </FadeIn>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {kpiList.map((kpi, index) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            decimals={kpi.decimals}
            suffix={kpi.suffix}
            hint={kpi.hint}
            delay={index * 0.04}
          />
        ))}
      </div>

      <FadeIn delay={0.08}>
        <article className="rounded-[28px] bg-background p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-medium text-primary">
            <Sparkles className="size-4" />
            Live AI Executive Summary
          </div>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed font-medium">{summaryText}</p>
          <Link
            href="/dashboard/recommendations"
            className="mt-4 inline-flex items-center text-[15px] text-primary hover:underline font-medium"
          >
            See recommended actions
            <ChevronRight className="size-4" />
          </Link>
        </article>
      </FadeIn>

      <div className="grid gap-4 lg:grid-cols-5">
        <ChartCard
          className="lg:col-span-3"
          title="Sentiment trend"
          question="Is guest mood improving week to week?"
          delay={0.06}
        >
          <SentimentTrendChart />
        </ChartCard>
        <ChartCard
          className="lg:col-span-2"
          title="Sentiment mix"
          question="How is the latest batch split?"
          delay={0.1}
        >
          <SentimentDonutChart />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Topic frequency"
          question="What are people talking about most?"
          delay={0.08}
        >
          <TopicBarChart />
        </ChartCard>
        <ChartCard
          title="Rating distribution"
          question="Where do scores cluster?"
          delay={0.12}
        >
          <RatingBarChart />
        </ChartCard>
      </div>

      <ChartCard
        title="Feedback volume"
        question="When is review traffic heaviest?"
        delay={0.1}
      >
        <VolumeAreaChart />
      </ChartCard>

      <FadeIn delay={0.12}>
        <article className="rounded-[28px] bg-background p-6 border border-black/5 dark:border-white/10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[17px] font-semibold">Critical issues</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Live operational items auto-clustered from your database.
              </p>
            </div>
            <Link
              href="/dashboard/issues"
              className="inline-flex items-center text-[13px] text-primary hover:underline"
            >
              View all
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-black/5 dark:divide-white/10">
            {liveIssues.length === 0 ? (
              <li className="py-4 text-[13px] text-muted-foreground">
                No issues detected yet. Upload feedback to auto-detect operational problems.
              </li>
            ) : liveIssues.map((issue) => (
              <li key={issue.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-[14px] font-medium">{issue.title}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {issue.mentions} mentions · {issue.trend}
                  </p>
                </div>
                <Badge variant={issue.priority === "High" || issue.priority === "CRITICAL" ? "negative" : "muted"}>
                  {issue.priority}
                </Badge>
              </li>
            ))}
          </ul>
        </article>
      </FadeIn>
    </div>
  );
}
