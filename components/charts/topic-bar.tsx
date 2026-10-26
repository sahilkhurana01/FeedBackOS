"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTick, chartTooltipStyle } from "@/components/charts/theme";

type TopicItem = { topic: string; mentions: number };

export function TopicBarChart() {
  const [data, setData] = useState<TopicItem[]>([]);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => { if (d.topicFrequency) setData(d.topicFrequency); })
      .catch(() => {});
  }, []);

  if (data.length === 0) {
    return (
      <div className="h-[260px] w-full flex items-center justify-center text-[13px] text-muted-foreground">
        No topics detected — upload reviews to see topic clusters
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
        >
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={chartTick} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="topic"
            width={96}
            tick={chartTick}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="mentions" name="Mentions" fill="#1d1d1f" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
