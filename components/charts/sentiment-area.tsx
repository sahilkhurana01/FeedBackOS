"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { SENTIMENT_TREND } from "@/lib/mock-data/landing";

export function SentimentAreaChart({ height = 180 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }} className="min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={[...SENTIMENT_TREND]} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="sentimentFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
          />
          <Area
            type="monotone"
            dataKey="positive"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#sentimentFill)"
            name="Positive %"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
