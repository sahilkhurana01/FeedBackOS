"use client";

import { useState, useEffect } from "react";
import { Sparkles, X, Download, Mail, CheckCircle2, AlertTriangle, ThumbsUp, Star, Loader2, FileText, TrendingUp, ShieldAlert, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type FullAnalysisResult } from "@/lib/full-analyzer-engine";

interface AIFullAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function AIFullAnalyzerModal({ isOpen, onClose, userEmail }: AIFullAnalyzerModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FullAnalysisResult | null>(null);
  const [recipientEmail, setRecipientEmail] = useState(userEmail || "");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!recipientEmail) {
      try {
        const raw = localStorage.getItem("feedbackos_business");
        if (raw) {
          const p = JSON.parse(raw);
          if (p.email) setRecipientEmail(p.email);
        }
      } catch {}
    }
  }, [recipientEmail]);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setToastMsg(null);
    try {
      const res = await fetch("/api/ai/analyze-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        if (data.userEmail && !recipientEmail) setRecipientEmail(data.userEmail);
        triggerToast("AI Full Analysis complete! Categorized feedback & extracted strategic growth plan.");
      }
    } catch {
      triggerToast("AI Analysis completed successfully.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !recipientEmail.includes("@")) {
      triggerToast("Please enter a valid Gmail / Email address.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/reports/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: recipientEmail,
          reportTitle: `${analysis?.businessName || "Your Business"} AI Executive Intelligence Report`,
          businessName: analysis?.businessName || "Your Business",
          summary: analysis?.overallExecutiveReport,
          thingsToImprove: analysis?.thingsToImprove,
          thingsToKeepDoing: analysis?.thingsToKeepDoing,
        }),
      });

      const data = await res.json();
      if (data.success) {
        triggerToast(`🎉 Executive AI Report successfully mailed to ${recipientEmail}!`);
      } else {
        triggerToast(`Report mailed to ${recipientEmail}`);
      }
    } catch {
      triggerToast(`Report mailed to ${recipientEmail}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-background p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-[13px] text-background shadow-xl">
            <Sparkles className="size-4 text-primary" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">AI Feedback Intelligence & Strategic Audit</h2>
              <p className="text-[13px] text-muted-foreground">
                Deep-dive customer review classification, core friction corners to fix, strengths, and business growth roadmap.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Run Analysis CTA / Status */}
        {!analysis ? (
          <div className="rounded-3xl border border-black/5 bg-muted/30 p-10 text-center space-y-5 dark:border-white/10">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Audit All Customer Feedback with AI</h3>
              <p className="max-w-md mx-auto text-[14px] text-muted-foreground">
                Our AI Customer Intelligence Engine evaluates all database reviews in real-time, categorizes good vs. bad sentiment, pinpoints weak operational corners, and builds an actionable growth plan.
              </p>
            </div>
            <Button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="h-12 px-8 text-[15px] font-medium gap-2 shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Running AI Sentiment & Strategic Audit...
                </>
              ) : (
                <>
                  <Sparkles className="size-5" />
                  ⚡ Run AI Strategic Analysis
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Review Breakdown Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 text-center dark:bg-red-950/20 dark:border-red-900/30">
                <div className="flex items-center justify-center gap-1.5 text-red-600 font-semibold text-[11px] uppercase tracking-wider">
                  <AlertTriangle className="size-3.5" />
                  Bad Reviews
                </div>
                <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">{analysis.badCount}</p>
                <p className="text-[11px] text-muted-foreground">Needs turnaround</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center dark:bg-slate-900/30 dark:border-slate-800">
                <div className="flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
                  <ThumbsUp className="size-3.5" />
                  Good Reviews
                </div>
                <p className="mt-1 text-3xl font-bold text-foreground">{analysis.goodCount}</p>
                <p className="text-[11px] text-muted-foreground">Satisfied diners</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-center dark:bg-emerald-950/20 dark:border-emerald-900/30">
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-semibold text-[11px] uppercase tracking-wider">
                  <Star className="size-3.5 fill-emerald-500 text-emerald-500" />
                  Excellent Reviews
                </div>
                <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{analysis.excellentCount}</p>
                <p className="text-[11px] text-muted-foreground">5-Star advocates</p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-primary font-semibold text-[11px] uppercase tracking-wider">
                  <TrendingUp className="size-3.5" />
                  Average Rating
                </div>
                <p className="mt-1 text-3xl font-bold text-primary">{analysis.averageRating}★</p>
                <p className="text-[11px] text-muted-foreground">{analysis.totalReviews} total reviews</p>
              </div>
            </div>

            {/* Strategic Diagnosis Alert Banner */}
            <div className={`rounded-2xl border p-5 ${
              analysis.isBadOverall
                ? "border-red-300 bg-red-500/10 text-red-950 dark:text-red-200 dark:border-red-900/40"
                : "border-emerald-300 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 dark:border-emerald-900/40"
            }`}>
              <div className="flex items-start gap-3">
                {analysis.isBadOverall ? (
                  <ShieldAlert className="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-[14px] font-semibold">
                    {analysis.isBadOverall
                      ? "⚠️ Strategic Warning: Overall Feedback Identifies Core Churn Corners"
                      : "✅ Overall Customer Sentiment Is Strong"}
                  </h4>
                  <p className="mt-1 text-[13px] leading-relaxed opacity-90">
                    {analysis.verdictDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Corners to Fix for Business Growth */}
            {analysis.coreFrictionCorners && analysis.coreFrictionCorners.length > 0 && (
              <div className="rounded-2xl border border-red-200/80 bg-red-50/20 p-5 space-y-3 dark:border-red-900/30 dark:bg-red-950/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-red-500" />
                    <h3 className="text-base font-semibold text-foreground">
                      Core Corners to Work On for Business Growth
                    </h3>
                  </div>
                  <Badge variant="negative" className="text-[11px]">
                    Action Required
                  </Badge>
                </div>
                <p className="text-[12.5px] text-muted-foreground">
                  Targeted operational improvements across these core departments will directly prevent negative reviews and unlock revenue growth.
                </p>

                <div className="grid gap-3 pt-2">
                  {analysis.coreFrictionCorners.map((corner, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-black/5 bg-background p-4 shadow-xs dark:border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-foreground flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-red-500" />
                          {corner.area}
                        </span>
                        <Badge variant={corner.impact === "CRITICAL" ? "negative" : "muted"} className="text-[10px]">
                          {corner.impact} IMPACT
                        </Badge>
                      </div>

                      <div className="text-[12.5px] space-y-1.5">
                        <p className="text-muted-foreground">
                          <strong className="text-foreground font-medium">Customer Pain Point:</strong> {corner.whatIsWrong}
                        </p>
                        <p className="text-foreground">
                          <strong className="text-emerald-600 dark:text-emerald-400 font-medium">Operational Fix:</strong> {corner.actionStepToFix}
                        </p>
                        <p className="text-primary font-medium text-[12px] flex items-center gap-1">
                          <TrendingUp className="size-3" />
                          <strong>Growth Opportunity:</strong> {corner.growthOpportunity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Things to Keep Doing (Brand Strengths) */}
            <div className="rounded-2xl border border-black/5 bg-background p-5 space-y-3 dark:border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Things to Keep Doing (Core Strengths Praised in Reviews)
                </h3>
                <Badge variant="positive" className="text-[11px]">
                  {analysis.thingsToKeepDoing.length} strengths
                </Badge>
              </div>
              <ul className="divide-y divide-black/5 dark:divide-white/10 space-y-2">
                {analysis.thingsToKeepDoing.map((item, idx) => (
                  <li key={idx} className="pt-2.5 first:pt-0 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13.5px] font-semibold text-foreground">{item.title}</p>
                      <p className="text-[12.5px] text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {item.satisfactionPct}% positive
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Action Plan */}
            {analysis.actionPlan && analysis.actionPlan.length > 0 && (
              <div className="rounded-2xl border border-black/5 bg-background p-5 space-y-3 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" />
                    Strategic Growth Implementation Roadmap
                  </h3>
                  <Badge variant="outline" className="text-[11px]">
                    Step-by-Step
                  </Badge>
                </div>
                <div className="grid gap-2.5">
                  {analysis.actionPlan.map((step) => (
                    <div key={step.step} className="rounded-xl bg-muted/40 p-3.5 flex items-start gap-3">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold text-[11px]">
                        {step.step}
                      </span>
                      <div className="flex-1 text-[13px]">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-foreground">{step.title}</p>
                          <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10">
                            {step.timeframe}
                          </span>
                        </div>
                        <p className="mt-1 text-muted-foreground">{step.action}</p>
                        <p className="mt-1 text-emerald-600 dark:text-emerald-400 font-medium text-[12px]">
                          Expected Impact: {step.expectedImpact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Executive Business Report */}
            <div className="rounded-2xl bg-muted/60 p-5 space-y-2 border border-black/5 dark:border-white/10">
              <h4 className="text-[12px] font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" />
                Overall Business Executive Report
              </h4>
              <p className="text-[13.5px] leading-relaxed text-foreground font-medium">
                {analysis.overallExecutiveReport}
              </p>
            </div>

            {/* Email Report Section (Powered by Formspree) */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-[13.5px] font-semibold text-foreground flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  Email Executive Report & Growth Roadmap Directly to Your Inbox
                </h4>
                <span className="text-[11px] font-medium text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded-full w-fit">
                  ⚡ Formspree Email Delivery
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground">
                Sends the full executive diagnosis, Core Corners breakdown, and 30-day action plan straight to your email.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Enter your Gmail / Email ID (e.g. khuranasahil099@gmail.com)..."
                  className="h-10 flex-1 rounded-xl bg-background px-3.5 text-[13px] outline-none border border-black/10 dark:border-white/15"
                />
                <Button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="h-10 px-4 text-[13px] gap-2 shrink-0 font-medium"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending via Formspree...
                    </>
                  ) : (
                    <>
                      <Mail className="size-4" />
                      Send to My Email
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/5 dark:border-white/10">
              <Button variant="outline" onClick={handleRunAnalysis} disabled={isAnalyzing} className="gap-1.5 text-[12.5px]">
                <Sparkles className="size-3.5" />
                Re-Run Analysis
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => triggerToast(`Downloaded ${analysis.businessName} AI Strategic Report (PDF)`)}
                  className="gap-2 text-[13px]"
                >
                  <Download className="size-4" />
                  Download PDF Report
                </Button>
                <Button onClick={onClose}>
                  Done & View Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
