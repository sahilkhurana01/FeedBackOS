"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-black/5 bg-background p-12 text-center shadow-xs dark:border-white/10">
      <div className="grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 mb-4">
        <AlertTriangle className="size-6" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
      <p className="mt-2 max-w-md text-[14px] text-muted-foreground">
        FeedbackOS encountered a temporary error while loading workspace data.
      </p>
      <Button onClick={() => reset()} className="mt-6 gap-2">
        <RefreshCw className="size-4" />
        Try Again
      </Button>
    </div>
  );
}
