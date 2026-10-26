import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  wordmark = true,
}: {
  className?: string;
  wordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label="FeedbackOS home"
    >
      <span
        aria-hidden
        className="grid size-7 place-items-center text-foreground"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none">
          <path
            d="M5 15.5c2.2-1.1 3.6-3.4 4.2-6.6.4 2.6 1.5 4.6 3.3 5.9 1.6 1.1 3.6 1.5 6.5 1.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M5 19h14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      </span>
      {wordmark ? (
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          FeedbackOS
        </span>
      ) : null}
    </Link>
  );
}
