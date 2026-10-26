"use client";

import { useState, useEffect } from "react";
import { User, Building, Bell, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<"profile" | "business" | "notifications" | "subscription">("profile");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bizName, setBizName] = useState("");
  const [bizIndustry, setBizIndustry] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("Business Administrator");
  const [userRole, setUserRole] = useState("Owner");

  useEffect(() => {
    // Load live data from localStorage first, then refresh from DB
    try {
      const raw = localStorage.getItem("feedbackos_business");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.name) setBizName(p.name);
        if (p.industry) setBizIndustry(p.industry);
        if (p.email) setUserEmail(p.email);
        if (p.user?.name) setUserName(p.user.name);
        if (p.user?.role) setUserRole(p.user.role);
      }
    } catch {}

    fetch("/api/business/onboarding")
      .then((r) => r.json())
      .then((data) => {
        if (data?.business) {
          if (data.business.name) setBizName(data.business.name);
          if (data.business.industry) setBizIndustry(data.business.industry);
          if (data.business.email) setUserEmail(data.business.email);
          if (data.business.user?.name) setUserName(data.business.user.name);
          if (data.business.user?.email && !userEmail) setUserEmail(data.business.user.email);
          if (data.business.user?.role) setUserRole(data.business.user.role);
        }
      })
      .catch(() => {});
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-[13px] text-background shadow-xl">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings & Preferences</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Manage your business profile, account settings, notification triggers, and plan.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-black/5 pb-2 dark:border-white/10">
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
          onClick={() => setActiveTab("business")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
            activeTab === "business" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <Building className="size-4" />
          Business Profile
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
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Account Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-muted-foreground">Role</label>
                <input
                  type="text"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none"
                />
              </div>
              <Button onClick={() => triggerToast("Account profile updated successfully")}>Save Changes</Button>
            </div>
          </div>
        )}

        {activeTab === "business" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Business Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-muted-foreground">Business Name</label>
                <input
                  type="text"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="Your business name"
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-muted-foreground">Industry Category</label>
                <select defaultValue="Cafe & Bakery" className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none">
                  <option>Cafe & Bakery</option>
                  <option>Restaurant / Dining</option>
                  <option>Salon & Spa</option>
                  <option>Clinic / Healthcare</option>
                  <option>Boutique Hotel</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-muted-foreground">Primary Location</label>
                <input
                  type="text"
                  defaultValue="Downtown Main St."
                  className="mt-1 h-10 w-full rounded-xl bg-muted px-4 text-[14px] outline-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={() => triggerToast("Business profile updated successfully")}>Save Changes</Button>
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


        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Notification Triggers</h3>
            <div className="space-y-4 divide-y divide-black/5 dark:divide-white/10">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium text-[14px]">Negative Sentiment Spike Alert</p>
                  <p className="text-[12px] text-muted-foreground">Notify when negative sentiment increases by 15% in a single day.</p>
                </div>
                <input type="checkbox" defaultChecked className="size-5 accent-primary" />
              </div>
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium text-[14px]">Weekly AI Executive Digest</p>
                  <p className="text-[12px] text-muted-foreground">Receive an automated Monday morning summary email.</p>
                </div>
                <input type="checkbox" defaultChecked className="size-5 accent-primary" />
              </div>
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium text-[14px]">High-Priority Issue Alerts</p>
                  <p className="text-[12px] text-muted-foreground">Immediate notification when a new High priority cluster is detected.</p>
                </div>
                <input type="checkbox" defaultChecked className="size-5 accent-primary" />
              </div>
              <div className="pt-4">
                <Button onClick={() => triggerToast("Notification settings saved")}>Save Preferences</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">Current Plan</h3>
                  <Badge variant="positive">Active</Badge>
                </div>
                <p className="text-[13px] text-muted-foreground mt-0.5">Growth Plan (₹1,499/month)</p>
              </div>
              <Button variant="outline" onClick={() => triggerToast("Plan change requested")}>Change Plan</Button>
            </div>

            <div className="space-y-3">
              <h4 className="text-[14px] font-medium">Included Features:</h4>
              <ul className="list-disc list-inside text-[13.5px] text-muted-foreground space-y-1">
                <li>Up to 2,000 feedback reviews analyzed / month</li>
                <li>AI Topic Detection & Sentiment Classification</li>
                <li>Smart Priority Engine</li>
                <li>Weekly AI Executive Summaries</li>
                <li>AI Growth Coach Unlimited Queries</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
