"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { Button } from "@/components/ui/button";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-background pb-8 pt-16 sm:pb-12 sm:pt-24">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-6">
        <motion.p
          className="text-[17px] font-semibold text-foreground"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          FeedbackOS
        </motion.p>
        <motion.h1
          className="mx-auto mt-3 max-w-4xl text-[40px] font-semibold leading-[1.07] tracking-tight text-foreground sm:text-6xl lg:text-[72px]"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          Turn customer feedback into growth.
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-2xl text-[19px] leading-relaxed text-muted-foreground sm:text-[21px]"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          FeedbackOS uses AI to understand what your customers are saying,
          identify what matters most, and tell you what to do next.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <Button size="lg" asChild>
            <Link href="/get-started">Start Analyzing Feedback</Link>
          </Button>
          <Link
            href="#product"
            className="inline-flex items-center text-[17px] text-primary hover:underline"
          >
            Explore Dashboard
            <ChevronRight className="size-4" />
          </Link>
        </motion.div>

        <motion.p
          className="mt-8 text-[14px] text-muted-foreground"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.24 }}
        >
          Feedback → AI Analysis → Business Action
        </motion.p>
      </div>

      <motion.div
        className="mx-auto mt-14 max-w-6xl px-4 sm:mt-20 sm:px-6"
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <DashboardPreview compact />
      </motion.div>
    </section>
  );
}
