import {
  Gauge,
  Tags,
  ListFilter,
  FileText,
  Lightbulb,
  MessageSquareText,
} from "lucide-react";

import { FadeIn, Stagger, StaggerItem } from "@/components/shared/motion";
import { FEATURES } from "@/lib/constants";

const ICONS = [Gauge, Tags, ListFilter, FileText, Lightbulb, MessageSquareText];

export function Features() {
  return (
    <section id="features" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-[19px] font-semibold text-foreground">Features</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Intelligence that ends in an action, not another chart.
          </h2>
        </FadeIn>

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
          {FEATURES.map((feature, index) => {
            const Icon = ICONS[index];
            return (
              <StaggerItem key={feature.title}>
                <article className="h-full rounded-[28px] bg-muted p-8 transition-transform duration-200 hover:-translate-y-0.5">
                  <Icon className="size-6 text-foreground" aria-hidden />
                  <h3 className="mt-5 text-[21px] font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {feature.body}
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
