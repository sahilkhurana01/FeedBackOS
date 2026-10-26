"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { chartTooltipStyle } from "@/components/charts/theme";

type DistItem = { name: string; value: number; fill: string };

export function SentimentDonutChart() {
  const [data, setData] = useState<DistItem[]>([]);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => { if (d.sentimentDistribution) setData(d.sentimentDistribution); })
      .catch(() => {});
  }, []);

  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div className="h-[260px] w-full flex items-center justify-center text-[13px] text-muted-foreground">
        No data yet — upload reviews to see sentiment breakdown
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={92}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(value) => [`${value}%`, "Share"]}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-1 flex justify-center gap-4 text-[12px] text-muted-foreground">
        {data.map((item) => (
          <li key={item.name} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: item.fill }} />
            {item.name} {item.value}%
          </li>
        ))}
      </ul>
    </div>
  );
}
