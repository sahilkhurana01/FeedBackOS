"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartTick, chartTooltipStyle } from "@/components/charts/theme";

type RatingItem = { rating: string; count: number };

export function RatingBarChart() {
  const [data, setData] = useState<RatingItem[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d.ratingDistribution && Array.isArray(d.ratingDistribution)) {
          setData(d.ratingDistribution);
        }
      })
      .catch(() => {});
  }, []);

  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="h-[260px] w-full flex items-center justify-center text-[13px] text-muted-foreground">
        No rating data yet — upload reviews to see distribution
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="rating" tick={chartTick} tickLine={false} axisLine={false} />
          <YAxis tick={chartTick} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="count" name="Reviews" fill="#0071e3" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
