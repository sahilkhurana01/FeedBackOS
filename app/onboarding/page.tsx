"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Sparkles, ArrowRight, CheckCircle2, MapPin, Mail, Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    industry: "Cafe & Bakery",
    location: "",
    email: "",
    monthlyVolume: "200-500",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim()) {
      setError("Please enter your Business Name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/business/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save business profile.");
      }

      localStorage.setItem("feedbackos_business", JSON.stringify(data.business));
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : "Onboarding failed.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-neutral-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[12.5px] font-medium text-primary mb-3">
          <Sparkles className="size-3.5" />
          Welcome to FeedbackOS
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Set up your business</h2>
        <p className="mt-1.5 text-[14.5px] text-muted-foreground">
          Tell us about your brand so AI can tailor sentiment insights for your business.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-6 shadow-xl rounded-3xl border border-black/5 dark:border-white/10 sm:px-8">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-xl font-semibold">Workspace Configured!</h3>
              <p className="text-[13.5px] text-muted-foreground">
                Redirecting to your personalized FeedbackOS Intelligence Dashboard...
              </p>
              <Loader2 className="size-5 animate-spin mx-auto text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-destructive/10 p-3 text-[13px] text-destructive">
                  {error}
                </div>
              )}

              {/* Business Name */}
              <div>
                <label className="block text-[13px] font-medium text-foreground">
                  Business / Brand Name *
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Northstar Café"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="h-11 w-full rounded-xl border border-black/10 bg-muted/40 px-3.5 text-[14px] outline-none focus:border-primary dark:border-white/15"
                  />
                </div>
              </div>

              {/* Industry Category */}
              <div>
                <label className="block text-[13px] font-medium text-foreground">
                  Industry Category *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-muted/40 px-3.5 text-[14px] outline-none focus:border-primary dark:border-white/15"
                >
                  <option value="Cafe & Bakery">Café & Bakery</option>
                  <option value="Restaurant / Dining">Restaurant / Fine Dining</option>
                  <option value="Salon & Spa">Salon & Wellness Spa</option>
                  <option value="Clinic / Healthcare">Clinic / Healthcare</option>
                  <option value="Boutique Hotel">Boutique Hotel & Stay</option>
                  <option value="Gym & Fitness">Gym & Fitness Center</option>
                  <option value="Retail & D2C">Retail & D2C E-Commerce</option>
                </select>
              </div>

              {/* Primary Location */}
              <div>
                <label className="block text-[13px] font-medium text-foreground">
                  Primary Location / City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    placeholder="e.g. Downtown Main St., San Francisco"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="h-11 w-full rounded-xl border border-black/10 bg-muted/40 px-3.5 text-[14px] outline-none focus:border-primary dark:border-white/15"
                  />
                </div>
              </div>

              {/* Support / Contact Email */}
              <div>
                <label className="block text-[13px] font-medium text-foreground">
                  Contact / Manager Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    placeholder="e.g. manager@northstarcafe.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-11 w-full rounded-xl border border-black/10 bg-muted/40 px-3.5 text-[14px] outline-none focus:border-primary dark:border-white/15"
                  />
                </div>
              </div>

              {/* Monthly Review Volume */}
              <div>
                <label className="block text-[13px] font-medium text-foreground">
                  Estimated Monthly Review Volume
                </label>
                <select
                  value={formData.monthlyVolume}
                  onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-muted/40 px-3.5 text-[14px] outline-none focus:border-primary dark:border-white/15"
                >
                  <option value="50-200">50 – 200 reviews / month</option>
                  <option value="200-500">200 – 500 reviews / month</option>
                  <option value="500-2000">500 – 2,000 reviews / month</option>
                  <option value="2000+">2,000+ reviews / month</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-[14.5px] font-medium gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Setting Up Workspace...
                  </>
                ) : (
                  <>
                    Complete Setup & Launch Dashboard
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
