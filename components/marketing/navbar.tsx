"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Show, UserButton } from "@clerk/nextjs";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function subscribeToScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured =
  Boolean(key) && key !== "pk_test_placeholder" && key?.startsWith("pk_");

export function Navbar() {
  const compact = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const showClerk = isClerkConfigured && mounted;

  return (
    <header className="sticky top-0 z-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div
        className={cn(
          "border-b border-black/5 bg-white/80 backdrop-blur-xl transition-[padding] duration-300 dark:border-white/10 dark:bg-black/75",
          compact ? "py-2" : "py-3",
        )}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] tracking-wide text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-1 md:flex">
            <ThemeToggle />
            {showClerk ? (
              <>
                <Show when="signed-out">
                  <Button variant="ghost" size="sm" className="text-[12px]" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button size="sm" className="text-[12px]" asChild>
                    <Link href="/sign-up">Get started</Link>
                  </Button>
                </Show>
                <Show when="signed-in">
                  <Button variant="ghost" size="sm" className="text-[12px] mr-2" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserButton />
                </Show>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-[12px]" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button size="sm" className="text-[12px]" asChild>
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="fixed inset-x-0 top-[52px] z-40 border-b border-black/5 bg-white md:hidden dark:border-white/10 dark:bg-black"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col gap-1 px-5 py-5" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-2 py-3 text-[17px] text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {showClerk ? (
                  <>
                    <Show when="signed-out">
                      <Button variant="outline" asChild onClick={() => setOpen(false)}>
                        <Link href="/sign-in">Sign in</Link>
                      </Button>
                      <Button asChild onClick={() => setOpen(false)}>
                        <Link href="/sign-up">Get started</Link>
                      </Button>
                    </Show>
                    <Show when="signed-in">
                      <Button asChild onClick={() => setOpen(false)}>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    </Show>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild onClick={() => setOpen(false)}>
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/sign-up">Get started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}





