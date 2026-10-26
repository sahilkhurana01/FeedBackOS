"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTick, chartTooltipStyle } from "@/components/charts/theme";

type VolumeItem = { day: string; reviews: number };

export function VolumeAreaChart() {
  const [data, setData] = useState<VolumeItem[]>([]);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => { if (d.feedbackVolume) setData(d.feedbackVolume); })
      .catch(() => {});
  }, []);

  if (data.length === 0) {
    return (
      <div className="h-[260px] w-full flex items-center justify-center text-[13px] text-muted-foreground">
        No volume data yet — upload reviews to track feedback over time
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0071e3" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#0071e3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tick={chartTick} tickLine={false} axisLine={false} />
          <YAxis tick={chartTick} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Area
            type="monotone"
            dataKey="reviews"
            name="Reviews"
            stroke="#0071e3"
            strokeWidth={2}
            fill="url(#volumeFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
