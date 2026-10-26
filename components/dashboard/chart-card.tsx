import type { ReactNode } from "react";

import { FadeIn } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  question,
  children,
  className,
  delay = 0,
}: {
  title: string;
  question: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay} className={cn("rounded-[28px] bg-background p-5 sm:p-6", className)}>
      <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">{question}</p>
      <div className="mt-4">{children}</div>
    </FadeIn>
  );
}
