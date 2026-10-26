import { CountUp } from "@/components/shared/count-up";
import { FadeIn } from "@/components/shared/motion";

export function KpiCard({
  label,
  value,
  decimals,
  suffix,
  hint,
  delay = 0,
}: {
  label: string;
  value: number;
  decimals: number;
  suffix: string;
  hint: string;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <article className="rounded-[22px] bg-background p-5">
        <p className="text-[12px] text-muted-foreground">{label}</p>
        <p className="mt-2 text-[28px] font-semibold tracking-tight">
          <CountUp value={value} decimals={decimals} />
          {suffix}
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>
      </article>
    </FadeIn>
  );
}
