"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function CountUp({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (reduce) return;

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduce]);

  const display = reduce ? value : current;

  return (
    <span className={className}>
      {display.toLocaleString(undefined, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
    </span>
  );
}
