import Link from "next/link";
import { Check } from "lucide-react";

import { FadeIn, Stagger, StaggerItem } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-[19px] font-semibold text-foreground">Pricing</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Start free. Grow when the insight pays for itself.
          </h2>
          <p className="mt-4 text-[17px] text-muted-foreground">
            Payments are not live yet. These plans show how FeedbackOS will be
            packaged for local businesses.
          </p>
        </FadeIn>

        <Stagger className="mt-16 grid gap-5 lg:grid-cols-3 lg:items-stretch" delay={0.05}>
          {PRICING_PLANS.map((plan) => (
            <StaggerItem key={plan.id} className="h-full">
              <article
                className={cn(
                  "flex h-full flex-col rounded-[28px] p-8",
                  plan.featured ? "bg-foreground text-background" : "bg-muted",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[21px] font-semibold">{plan.name}</h3>
                  {plan.featured ? (
                    <Badge className="border-transparent bg-background/15 text-background">
                      Recommended
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-5 text-[34px] font-semibold tracking-tight">{plan.price}</p>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    plan.featured ? "text-background/65" : "text-muted-foreground",
                  )}
                >
                  {plan.cadence}
                </p>
                <p
                  className={cn(
                    "mt-4 text-[15px]",
                    plan.featured ? "text-background/70" : "text-muted-foreground",
                  )}
                >
                  {plan.description}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[15px]">
                      <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={plan.featured ? "secondary" : "default"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
