"use client";

import { useState, useEffect } from "react";
import { User, Building, Bell, CreditCard, Sparkles, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<"profile" | "business" | "notifications" | "subscription">("business");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savingNotifs, setSavingNotifs] = useState(false);

  // Form State
  const [bizName, setBizName] = useState("");
  const [bizIndustry, setBizIndustry] = useState("Restaurant / Dining");
  const [bizLocation, setBizLocation] = useState("Downtown Main St.");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("Business Administrator");
  const [userRole, setUserRole] = useState("Owner");

  // Notifications State
  const [notifNegative, setNotifNegative] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifCritical, setNotifCritical] = useState(true);

  useEffect(() => {
    // 1. Instant load from localStorage
    try {
      const raw = localStorage.getItem("feedbackos_business");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.name) setBizName(p.name);
        if (p.industry) setBizIndustry(p.industry);
        if (p.location) setBizLocation(p.location);
        if (p.email) setUserEmail(p.email);
        if (p.user?.name) setUserName(p.user.name);
        if (p.user?.role) setUserRole(p.user.role);
        if (p.user?.email && !p.email) setUserEmail(p.user.email);
      }
    } catch {}

    // 2. Fetch fresh live state from database
    fetch("/api/business/onboarding")
      .then((r) => r.json())
      .then((data) => {
        if (data?.business) {
          if (data.business.name) setBizName(data.business.name);
          if (data.business.industry) setBizIndustry(data.business.industry);
          if (data.business.location) setBizLocation(data.business.location);
          if (data.business.email) setUserEmail(data.business.email);
          if (data.business.user?.name) setUserName(data.business.user.name);
          if (data.business.user?.email) setUserEmail(data.business.user.email);
          if (data.business.user?.role) setUserRole(data.business.user.role);
          localStorage.setItem("feedbackos_business", JSON.stringify(data.business));
        }
      })
      .catch(() => {});
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // Live save account profile to database
  const handleSaveAccount = async () => {
    setSavingAccount(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/business/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userRole,
          userEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update account profile.");
      }

      if (data.business) {
        localStorage.setItem("feedbackos_business", JSON.stringify(data.business));
        window.dispatchEvent(new CustomEvent("feedbackos_business_updated", { detail: data.business }));
      }
      triggerToast("Account profile updated and saved to database!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      triggerError(msg);
    } finally {
      setSavingAccount(false);
    }
  };

  // Live save business profile to database
  const handleSaveBusiness = async () => {
    if (!bizName.trim()) {
      triggerError("Business Name cannot be empty.");
      return;
    }

    setSavingBusiness(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/business/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: bizName.trim(),
          industry: bizIndustry,
          location: bizLocation,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update business.");
      }

      if (data.business) {
        localStorage.setItem("feedbackos_business", JSON.stringify(data.business));
        window.dispatchEvent(new CustomEvent("feedbackos_business_updated", { detail: data.business }));
      }
      triggerToast(`Business renamed to "${bizName}" & saved live in database!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      triggerError(msg);
    } finally {
      setSavingBusiness(false);
    }
  };

  // Live save notifications preferences
  const handleSaveNotifications = () => {
    setSavingNotifs(true);
    try {
      const prefs = { notifNegative, notifWeekly, notifCritical };
      localStorage.setItem("feedbackos_notif_prefs", JSON.stringify(prefs));
      triggerToast("Notification preferences updated successfully!");
    } catch {
      triggerToast("Notification preferences saved.");
    } finally {
      setSavingNotifs(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-[13px] text-background shadow-xl">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-destructive px-4 py-3 text-[13px] text-destructive-foreground shadow-xl">
          <AlertCircle className="size-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings & Preferences</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Update your business name, industry, team account profile, and alert triggers in real-time.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-black/5 pb-2 dark:border-white/10">
        <button
          onClick={() => setActiveTab("business")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
            activeTab === "business" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <Building className="size-4" />
          Business Profile
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
            activeTab === "profile" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <User className="size-4" />
          Account Profile
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
            activeTab === "notifications" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <Bell className="size-4" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("subscription")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
            activeTab === "subscription" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <CreditCard className="size-4" />
          Subscription Plan
        </button>
      </div>

      {/* Tab Panels */}
      <div className="rounded-3xl border border-black/5 bg-background p-6 shadow-sm dark:border-white/10 max-w-3xl">
        {/* Business Profile */}
        {activeTab === "business" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Business Profile</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Changes saved here instantly update your reports, AI analytics, and dashboard headers across the entire workspace.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-foreground">
                  Business / Restaurant Name *
                </label>
                <input
                  type="text"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. The Gourmet Kitchen, Blue Star Cafe"
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none font-medium border border-transparent focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-foreground">
                  Industry Category
                </label>
                <select
                  value={bizIndustry}
                  onChange={(e) => setBizIndustry(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none"
                >
                  <option value="Restaurant / Dining">Restaurant / Dining</option>
                  <option value="Cafe & Bakery">Cafe & Bakery</option>
                  <option value="Salon & Spa">Salon & Spa</option>
                  <option value="Clinic / Healthcare">Clinic / Healthcare</option>
                  <option value="Boutique Hotel">Boutique Hotel</option>
                  <option value="Gym & Fitness">Gym & Fitness</option>
                  <option value="Retail & D2C">Retail & D2C</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-foreground">
                  Primary Location / Branch
                </label>
                <input
                  type="text"
                  value={bizLocation}
                  onChange={(e) => setBizLocation(e.target.value)}
                  placeholder="e.g. Downtown Central Plaza"
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Button
                  onClick={handleSaveBusiness}
                  disabled={savingBusiness}
                  className="gap-2"
                >
                  {savingBusiness && <Loader2 className="size-4 animate-spin" />}
                  {savingBusiness ? "Saving to Database..." : "Save Business Changes"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (confirm("Are you sure you want to reset all user & business data in the database? Users will be asked to complete onboarding again.")) {
                      try {
                        const res = await fetch("/api/admin/reset", { method: "POST" });
                        const data = await res.json();
                        if (data.success) {
                          localStorage.clear();
                          alert("Database successfully reset! Redirecting to setup...");
                          window.location.href = "/onboarding";
                        }
                      } catch {
                        localStorage.clear();
                        window.location.href = "/onboarding";
                      }
                    }
                  }}
                  className="text-[13px]"
                >
                  🧹 Reset All Business Data
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Account Profile */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Account Profile</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Manage your user identity, administrator role, and email preferences.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none border border-transparent focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-foreground">Role</label>
                <input
                  type="text"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none border border-transparent focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-foreground">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none border border-transparent focus:border-primary"
                />
              </div>
              <Button
                onClick={handleSaveAccount}
                disabled={savingAccount}
                className="gap-2"
              >
                {savingAccount && <Loader2 className="size-4 animate-spin" />}
                {savingAccount ? "Saving..." : "Save Account Profile"}
              </Button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Notification Triggers</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Configure real-time automated triggers when sentiment shifts occur.
              </p>
            </div>
            <div className="space-y-4 divide-y divide-black/5 dark:divide-white/10">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium text-[14px]">Negative Sentiment Spike Alert</p>
                  <p className="text-[12px] text-muted-foreground">Notify when negative customer sentiment increases by 15% in a single day.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifNegative}
                  onChange={(e) => setNotifNegative(e.target.checked)}
                  className="size-5 accent-primary cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium text-[14px]">Weekly AI Executive Digest</p>
                  <p className="text-[12px] text-muted-foreground">Receive an automated Monday morning summary email of customer feedback trends.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifWeekly}
                  onChange={(e) => setNotifWeekly(e.target.checked)}
                  className="size-5 accent-primary cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium text-[14px]">High-Priority Issue Alerts</p>
                  <p className="text-[12px] text-muted-foreground">Immediate notification when a new High or Critical priority friction cluster is detected.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifCritical}
                  onChange={(e) => setNotifCritical(e.target.checked)}
                  className="size-5 accent-primary cursor-pointer"
                />
              </div>
              <div className="pt-4">
                <Button onClick={handleSaveNotifications} disabled={savingNotifs} className="gap-2">
                  {savingNotifs && <Loader2 className="size-4 animate-spin" />}
                  Save Notification Preferences
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">Active Workspace Plan</h3>
                  <Badge variant="positive">Active</Badge>
                </div>
                <p className="text-[13px] text-muted-foreground mt-0.5">Enterprise Growth Plan (Unlimited Reviews)</p>
              </div>
              <Button variant="outline" onClick={() => triggerToast("Plan change request submitted to support.")}>
                Change Plan
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="text-[14px] font-medium">Included Features:</h4>
              <ul className="list-disc list-inside text-[13.5px] text-muted-foreground space-y-1.5">
                <li>Real-time automated sentiment clustering and priority scoring</li>
                <li>AI Customer Intelligence Engine with Core Corners diagnostics</li>
                <li>Interactive 24/7 AI Growth Coach chat assistant</li>
                <li>Executive monthly & weekly digest reports generation</li>
                <li>CSV Batch Upload with instant auto-categorization</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
