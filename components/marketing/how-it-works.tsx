import { Archive, Brain, ListOrdered, Rocket } from "lucide-react";

import { FadeIn, Stagger, StaggerItem } from "@/components/shared/motion";
import { HOW_IT_WORKS } from "@/lib/constants";

const ICONS = [Archive, Brain, ListOrdered, Rocket];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-[19px] font-semibold text-foreground">How it works</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Collect. Understand. Prioritize. Act.
          </h2>
        </FadeIn>

        <Stagger className="mt-16 grid gap-10 md:grid-cols-4 md:gap-6" delay={0.05}>
          {HOW_IT_WORKS.map((item, index) => {
            const Icon = ICONS[index];
            return (
              <StaggerItem key={item.step}>
                <article className="text-center md:text-left">
                  <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-muted md:mx-0">
                    <Icon className="size-6 text-foreground" aria-hidden />
                  </div>
                  <p className="text-[12px] text-muted-foreground">{item.step}</p>
                  <h3 className="mt-1 text-[21px] font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
