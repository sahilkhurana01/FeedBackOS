"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, Loader2, Inbox } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type LiveRec = {
  id: string;
  category: string;
  issue: string;
  title: string;
  whyItMatters: string;
  recommendedAction: string;
  priority: string;
  expectedImpact: string;
  effort: string;
  status: "Pending" | "In Progress" | "Completed";
};

const CATEGORIES = ["All", "Immediate Actions", "This Week", "Monitor", "Positive Opportunities"];

export function ActionCenter() {
  const [items, setItems] = useState<LiveRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((data) => {
        if (data.recommendations && data.recommendations.length > 0) {
          setItems(data.recommendations);
          setEmpty(false);
        } else {
          setEmpty(true);
        }
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (id: string, newStatus: "Pending" | "In Progress" | "Completed") => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const filteredItems = items.filter((item) => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const statusMatch = statusFilter === "All" || item.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h1 className="text-3xl font-semibold tracking-tight">AI Action Center</h1>
          </div>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Clear, prioritized operational directives generated from your actual customer feedback.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-black/5 bg-background p-16 dark:border-white/10">
          <Loader2 className="size-8 text-primary animate-spin mb-4" />
          <p className="text-[14px] text-muted-foreground">Generating AI recommendations from your reviews...</p>
        </div>
      )}

      {!loading && empty && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-black/5 bg-background p-16 text-center dark:border-white/10">
          <Inbox className="size-10 text-muted-foreground/40 mb-4" />
          <p className="text-[16px] font-semibold text-foreground">No recommendations yet</p>
          <p className="mt-1 text-[13px] text-muted-foreground max-w-sm">
            Upload customer feedback CSV to automatically generate AI-powered action recommendations.
          </p>
        </div>
      )}

      {!loading && !empty && (
        <>
          {/* Category Pills & Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-foreground text-background shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] text-muted-foreground">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-xl bg-muted px-3 text-[12.5px] outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Recommendation List */}
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-3xl border border-black/5 bg-background p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[11px]">
                          {rec.category}
                        </Badge>
                        <span className="text-muted-foreground text-[12px]">•</span>
                        <span className="text-[12px] font-medium text-muted-foreground">Issue: {rec.issue}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground">{rec.title}</h3>

                      <div className="space-y-2 rounded-2xl bg-muted/50 p-4 border border-black/5 dark:border-white/10">
                        <p className="text-[13px] text-muted-foreground">
                          <span className="font-medium text-foreground">Why it matters:</span> {rec.whyItMatters}
                        </p>
                        <p className="text-[14px] font-medium text-foreground">
                          <span className="text-primary font-semibold">Recommended Action:</span> {rec.recommendedAction}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground pt-1">
                        <span>
                          Priority: <strong className="text-foreground">{rec.priority}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Expected Impact: <strong className="text-emerald-600 dark:text-emerald-400">{rec.expectedImpact}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Effort: <strong className="text-foreground">{rec.effort}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex shrink-0 flex-col gap-2 min-w-[140px]">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                      <select
                        value={rec.status}
                        onChange={(e) =>
                          handleStatusChange(rec.id, e.target.value as "Pending" | "In Progress" | "Completed")
                        }
                        className={`h-10 rounded-xl px-3 text-[13px] font-medium border outline-none ${
                          rec.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                            : rec.status === "In Progress"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800"
                            : "bg-muted text-foreground border-transparent"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>

                      {rec.status === "Completed" && (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium pt-1">
                          <CheckCircle2 className="size-3.5" /> Action verified
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-black/5 bg-background p-12 text-center text-muted-foreground dark:border-white/10">
                No recommendations found for the selected filter view.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
