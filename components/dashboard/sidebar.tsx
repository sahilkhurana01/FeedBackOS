"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CircleAlert,
  FileText,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { DASHBOARD_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<(typeof DASHBOARD_NAV)[number]["icon"], LucideIcon> = {
  overview: LayoutDashboard,
  feedback: MessageSquare,
  insights: Sparkles,
  issues: CircleAlert,
  recommendations: Lightbulb,
  coach: Bot,
  reports: FileText,
  settings: Settings,
};

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [bizName, setBizName] = useState<string>("Your Business");

  useEffect(() => {
    // First read from localStorage for instant display
    try {
      const raw = localStorage.getItem("feedbackos_business");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.name) setBizName(parsed.name);
      }
    } catch {}

    // Then fetch live from DB to keep updated
    fetch("/api/business/onboarding")
      .then((r) => r.json())
      .then((data) => {
        if (data?.business?.name) {
          setBizName(data.business.name);
          localStorage.setItem("feedbackos_business", JSON.stringify(data.business));
        }
      })
      .catch(() => {});

    const onUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.name) {
        setBizName(customEvent.detail.name);
      }
    };

    window.addEventListener("feedbackos_business_updated", onUpdate);
    return () => window.removeEventListener("feedbackos_business_updated", onUpdate);
  }, []);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="px-5 py-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Dashboard">
        {DASHBOARD_NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors",
                active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-2xl bg-muted px-3 py-3">
        <p className="text-[11px] text-muted-foreground">Workspace</p>
        <p className="mt-0.5 text-[13px] font-medium truncate">{bizName}</p>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
          Live data
        </p>
      </div>
    </div>
  );
}
