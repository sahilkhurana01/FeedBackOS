import { FadeIn } from "@/components/shared/motion";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";

export function ProductPreview() {
  return (
    <section id="product" className="bg-muted py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-[19px] font-semibold text-foreground">Product</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            A dashboard that already knows what to do next.
          </h2>
          <p className="mt-4 text-[19px] leading-relaxed text-muted-foreground">
            Sentiment, topics, critical issues, and AI recommendations — live UI,
            demo data for Northstar Café.
          </p>
        </FadeIn>

        <FadeIn className="mt-16" delay={0.08}>
          <DashboardPreview />
        </FadeIn>
      </div>
    </section>
  );
}
