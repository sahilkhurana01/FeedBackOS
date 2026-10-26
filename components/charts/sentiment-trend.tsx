"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { chartTick, chartTooltipStyle } from "@/components/charts/theme";

type TrendPoint = { week: string; positive: number; negative: number; neutral: number };

export function SentimentTrendChart() {
  const [data, setData] = useState<TrendPoint[]>([]);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => { if (d.sentimentTrend) setData(d.sentimentTrend); })
      .catch(() => {});
  }, []);

  if (data.length === 0) {
    return (
      <div className="h-[260px] w-full flex items-center justify-center text-[13px] text-muted-foreground">
        No data yet — upload reviews to see sentiment trends
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="week" tick={chartTick} tickLine={false} axisLine={false} />
          <YAxis tick={chartTick} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="positive" name="Positive %" stroke="#0071e3" strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="neutral" name="Neutral %" stroke="#86868b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="negative" name="Negative %" stroke="#d70015" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
