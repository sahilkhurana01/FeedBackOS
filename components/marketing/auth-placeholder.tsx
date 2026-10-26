"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthPlaceholder({
  title,
  subtitle,
  submitLabel,
}: {
  title: string;
  subtitle: string;
  submitLabel: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16">
        <h1 className="text-[40px] font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{subtitle}</p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Work email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@northstar.cafe"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            {submitLabel}
          </Button>
        </form>
        {submitted ? (
          <p className="mt-4 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground" role="status">
            Preview only — real accounts arrive with Clerk in a later phase.
          </p>
        ) : null}
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/" className="text-foreground underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
