import { FadeIn } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { RECOMMENDATION_SHOWCASE } from "@/lib/mock-data/landing";

export function RecommendationShowcase() {
  const rec = RECOMMENDATION_SHOWCASE;

  return (
    <section className="bg-muted py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-2">
        <FadeIn>
          <p className="text-[19px] font-semibold text-foreground">What to do next</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            The AI does not stop at “customers are unhappy.”
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted-foreground">
            FeedbackOS turns a repeated complaint into a ranked issue, a reason it
            matters, and a short list of actions a busy owner can take this week.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <article className="rounded-[32px] bg-card p-8 shadow-card sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] text-muted-foreground">Problem</p>
                <h3 className="mt-1 text-[28px] font-semibold tracking-tight">
                  {rec.problem}
                </h3>
              </div>
              <Badge variant="negative">{rec.priority} priority</Badge>
            </div>

            <div className="mt-8 rounded-2xl bg-muted p-5">
              <p className="text-[12px] text-muted-foreground">Why it matters</p>
              <p className="mt-2 text-[15px] leading-relaxed">{rec.why}</p>
            </div>

            <div className="mt-8">
              <p className="text-[12px] text-muted-foreground">Recommended actions</p>
              <ol className="mt-4 space-y-4">
                {rec.actions.map((action, index) => (
                  <li key={action} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-foreground text-[11px] font-medium text-background">
                      {index + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ol>
            </div>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}
