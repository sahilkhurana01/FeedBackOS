"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Search, UploadCloud, Sparkles } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { UploadModal } from "@/components/dashboard/upload-modal";
import { AIFullAnalyzerModal } from "@/components/dashboard/ai-full-analyzer-modal";


type LiveNotification = { id: string; title: string; body: string; time: string };

const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured =
  Boolean(key) && key !== "pk_test_placeholder" && key?.startsWith("pk_");

function ClerkUserSectionMounted() {
  const { user, isLoaded } = useUser();
  const [bizName, setBizName] = useState<string>("Your Business");
  const [adminName, setAdminName] = useState<string>("Sahil Khurana");

  useEffect(() => {
    const loadData = () => {
      const raw = localStorage.getItem("feedbackos_business");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.name) setBizName(parsed.name);
          if (parsed.user?.name) setAdminName(parsed.user.name);
        } catch {}
      }
    };
    loadData();

    fetch("/api/business/onboarding")
      .then((r) => r.json())
      .then((d) => {
        if (d?.business?.name) setBizName(d.business.name);
        if (d?.business?.user?.name) setAdminName(d.business.user.name);
      })
      .catch(() => {});

    const onUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.name) setBizName(customEvent.detail.name);
      if (customEvent.detail?.user?.name) setAdminName(customEvent.detail.user.name);
    };

    window.addEventListener("feedbackos_business_updated", onUpdate);
    return () => window.removeEventListener("feedbackos_business_updated", onUpdate);
  }, []);

  const userName = isLoaded && user ? user.fullName || user.username || adminName : adminName;

  return (
    <div className="hidden items-center gap-2 pl-1 sm:flex">
      <div className="text-right">
        <p className="text-[12px] font-semibold leading-tight text-foreground">{bizName}</p>
        <p className="text-[11px] text-muted-foreground">{userName}</p>
      </div>
      {isLoaded && user ? (
        <UserButton />
      ) : (
        <span
          className="grid size-8 place-items-center rounded-full bg-foreground text-[11px] font-medium text-background"
          aria-label={userName}
        >
          {userName.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function ClerkUserSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <DemoUserSection />;
  return <ClerkUserSectionMounted />;
}

function DemoUserSection() {
  const [bizName, setBizName] = useState<string>("Your Business");
  const [adminName, setAdminName] = useState<string>("Sahil Khurana");

  useEffect(() => {
    const loadData = () => {
      const raw = localStorage.getItem("feedbackos_business");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.name) setBizName(parsed.name);
          if (parsed.user?.name) setAdminName(parsed.user.name);
        } catch {}
      }
    };
    loadData();

    fetch("/api/business/onboarding")
      .then((r) => r.json())
      .then((d) => {
        if (d?.business?.name) setBizName(d.business.name);
        if (d?.business?.user?.name) setAdminName(d.business.user.name);
      })
      .catch(() => {});

    const onUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.name) setBizName(customEvent.detail.name);
      if (customEvent.detail?.user?.name) setAdminName(customEvent.detail.user.name);
    };

    window.addEventListener("feedbackos_business_updated", onUpdate);
    return () => window.removeEventListener("feedbackos_business_updated", onUpdate);
  }, []);

  return (
    <div className="hidden items-center gap-2 pl-1 sm:flex">
      <div className="text-right">
        <p className="text-[12px] font-semibold leading-tight text-foreground">{bizName}</p>
        <p className="text-[11px] text-muted-foreground">{adminName}</p>
      </div>
      <span
        className="grid size-8 place-items-center rounded-full bg-foreground text-[11px] font-medium text-background"
        aria-label={adminName}
      >
        {adminName.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}


export function Topbar({ onMenu }: { onMenu: () => void }) {
  const [open, setOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [aiAnalyzerOpen, setAiAnalyzerOpen] = useState(false);
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  // Fetch live notifications from database
  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data?.notifications) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="flex h-16 items-center gap-3 border-b border-black/5 bg-background/80 px-4 backdrop-blur-xl sm:px-6 dark:border-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={onMenu}
        >
          <Menu className="size-5" />
        </Button>

        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search reviews, topics, issues..."
            className="h-10 w-full max-w-md rounded-full bg-muted pl-10 pr-4 text-[13px] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setAiAnalyzerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 h-9 rounded-full px-3.5 text-[12.5px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            <Sparkles className="size-3.5" />
            ⚡ AI Full Analysis
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setUploadOpen(true)}
            className="hidden md:flex items-center gap-1.5 h-9 rounded-full px-3 text-[12.5px]"
          >
            <UploadCloud className="size-3.5" />
            Upload Batch
          </Button>

          <ThemeToggle />
          <div className="relative" ref={panelRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
            </Button>
            {open ? (
              <div
                role="dialog"
                aria-label="Notifications"
                className="absolute right-0 top-[calc(100%+8px)] z-40 w-80 rounded-2xl bg-popover p-2 shadow-elevated"
              >
                <p className="px-3 py-2 text-[12px] font-medium">Live Notifications</p>
                <ul>
                  {notifications.length === 0 ? (
                    <li className="px-3 py-2.5 text-[12px] text-muted-foreground">Loading notifications...</li>
                  ) : notifications.map((item) => (
                    <li key={item.id} className="rounded-xl px-3 py-2.5 hover:bg-muted">
                      <p className="text-[13px] font-medium">{item.title}</p>
                      <p className="text-[12px] text-muted-foreground">{item.body}</p>
                      <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                        {item.time}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {isClerkConfigured ? <ClerkUserSection /> : <DemoUserSection />}
        </div>
      </header>

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
      <AIFullAnalyzerModal isOpen={aiAnalyzerOpen} onClose={() => setAiAnalyzerOpen(false)} />
    </>
  );
}




