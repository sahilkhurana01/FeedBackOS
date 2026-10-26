import { Features } from "@/components/marketing/features";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Navbar } from "@/components/marketing/navbar";
import { Pricing } from "@/components/marketing/pricing";
import { ProblemSection } from "@/components/marketing/problem-section";
import { ProductPreview } from "@/components/marketing/product-preview";
import { RecommendationShowcase } from "@/components/marketing/recommendation-showcase";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main id="main">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <ProductPreview />
        <Features />
        <RecommendationShowcase />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
