import { Inbox, Layers, MessageCircleWarning, ListTodo } from "lucide-react";

import { FadeIn, Stagger, StaggerItem } from "@/components/shared/motion";
import { PROBLEM_POINTS } from "@/lib/constants";

const ICONS = [Inbox, Layers, MessageCircleWarning, ListTodo];

export function ProblemSection() {
  return (
    <section id="problem" className="bg-muted py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-[19px] font-semibold text-foreground">The problem</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Feedback is everywhere. Clarity is not.
          </h2>
        </FadeIn>

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2" delay={0.05}>
          {PROBLEM_POINTS.map((point, index) => {
            const Icon = ICONS[index];
            return (
              <StaggerItem key={point.title}>
                <article className="h-full rounded-[28px] bg-card p-8 shadow-card">
                  <Icon className="size-6 text-foreground" aria-hidden />
                  <h3 className="mt-5 text-[21px] font-semibold">{point.title}</h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">
                    {point.body}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

        <FadeIn className="mx-auto mt-16 max-w-3xl text-center" delay={0.1}>
          <p className="text-[28px] font-semibold leading-snug tracking-tight text-foreground sm:text-[34px]">
            FeedbackOS turns feedback overload into clear business actions.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
