"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Check if user has completed business onboarding in live database
    fetch("/api/business/onboarding")
      .then((res) => res.json())
      .then((data) => {
        if (!data.hasBusiness || !data.business) {
          localStorage.removeItem("feedbackos_business");
          window.location.href = "/onboarding";
        } else {
          localStorage.setItem("feedbackos_business", JSON.stringify(data.business));
        }
      })
      .catch(() => {});
  }, []);


  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);


  return (
    <div className="flex min-h-full bg-muted">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-black/5 bg-background lg:block dark:border-white/10">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/30"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="relative h-full w-72 max-w-[86vw] bg-background shadow-elevated"
              initial={reduce ? false : { x: -24 }}
              animate={{ x: 0 }}
              exit={reduce ? undefined : { x: -24 }}
              transition={{ duration: 0.22 }}
            >
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
