"use client";

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted/80 ${className || ""}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-background p-5 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Hero Summary Skeleton */}
      <div className="rounded-[28px] bg-background p-6 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-[28px] bg-background p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-[220px] w-full" />
        </div>
        <div className="lg:col-span-2 rounded-[28px] bg-background p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-[220px] w-full" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="rounded-3xl bg-background p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
