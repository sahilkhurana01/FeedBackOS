export const chartTooltipStyle = {
  background: "var(--popover)",
  border: "1px solid color-mix(in srgb, var(--border) 80%, transparent)",
  borderRadius: 14,
  fontSize: 12,
  color: "var(--popover-foreground)",
  boxShadow: "0 8px 30px rgb(0 0 0 / 0.08)",
} as const;

export const chartTick = {
  fontSize: 11,
  fill: "var(--muted-foreground)",
} as const;
