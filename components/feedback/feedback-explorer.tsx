"use client";

import { useState, useMemo, useEffect } from "react";

import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  ThumbsUp,
  ThumbsDown,
  Minus,
  MessageSquareQuote,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  confidence: number;
  topic: string;
  priority: "High" | "Medium" | "Low";
  date: string;
  source: string;
  content: string;
  aiSummary: string;
  suggestedAction: string;
  keyPhrases: string[];
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FeedbackExplorer() {
  const [liveReviews, setLiveReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/feedback/list?search=${encodeURIComponent(search)}&rating=ALL&sentiment=${sentimentFilter.toUpperCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.feedbacks)) {
          const mapped: ReviewItem[] = data.feedbacks.map((f: any) => ({
            id: f.id,
            author: f.author || "Anonymous Customer",
            avatar: (f.author || "AC").slice(0, 2).toUpperCase(),
            rating: f.rating,
            sentiment: f.sentiment === "POSITIVE" ? "Positive" : f.sentiment === "NEGATIVE" ? "Negative" : "Neutral",
            confidence: Math.round((f.confidence || 0.92) * 100),
            topic: Array.isArray(f.topics) ? f.topics[0] || "Quality" : "General",
            priority: f.priority === "HIGH" || f.priority === "CRITICAL" ? "High" : f.priority === "LOW" ? "Low" : "Medium",
            source: f.source || "Google Reviews",
            date: f.date || new Date().toISOString().split("T")[0],
            content: f.text,
            aiSummary: `AI Analysis: Customer feedback categorized under ${Array.isArray(f.topics) ? f.topics[0] : "Quality"}.`,
            keyPhrases: Array.isArray(f.topics) ? f.topics : ["Quality", "Service"],
            suggestedAction: f.priority === "HIGH" ? "Immediate shift adjustment recommended" : "Monitor weekly sentiment trend",
          }));
          setLiveReviews(mapped);
        } else {
          setLiveReviews([]);
        }
      })
      .catch(() => {
        setLiveReviews([]);
      })
      .finally(() => setIsLoading(false));
  }, [search, sentimentFilter]);

  const activeReviews = liveReviews;


  const topics = useMemo(() => {
    const list = Array.from(new Set(activeReviews.map((r) => r.topic)));
    return ["all", ...list];
  }, [activeReviews]);

  const filteredReviews = useMemo(() => {
    return activeReviews.filter((r) => {
      const matchesSearch =
        r.content.toLowerCase().includes(search.toLowerCase()) ||
        r.author.toLowerCase().includes(search.toLowerCase()) ||
        r.topic.toLowerCase().includes(search.toLowerCase());
      const matchesSentiment = sentimentFilter === "all" || r.sentiment.toLowerCase() === sentimentFilter.toLowerCase();
      const matchesTopic = topicFilter === "all" || r.topic.toLowerCase() === topicFilter.toLowerCase();
      const matchesPriority = priorityFilter === "all" || r.priority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesSentiment && matchesTopic && matchesPriority;
    });
  }, [activeReviews, search, sentimentFilter, topicFilter, priorityFilter]);


  const totalPages = Math.ceil(filteredReviews.length / pageSize) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, page, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Feedback Explorer</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Search, filter, and inspect detailed AI analysis on every review.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-[13px]">
            {filteredReviews.length} reviews matched
          </Badge>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/5 bg-background p-4 dark:border-white/10">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search reviews, customer name, keywords..."
            className="h-10 w-full rounded-xl bg-muted pl-9 pr-4 text-[13px] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Sentiment Selector */}
        <select
          value={sentimentFilter}
          onChange={(e) => {
            setSentimentFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-xl bg-muted px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>

        {/* Topic Selector */}
        <select
          value={topicFilter}
          onChange={(e) => {
            setTopicFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-xl bg-muted px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Topics</option>
          {topics.filter((t) => t !== "all").map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Priority Selector */}
        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-xl bg-muted px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        {(search || sentimentFilter !== "all" || topicFilter !== "all" || priorityFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setSentimentFilter("all");
              setTopicFilter("all");
              setPriorityFilter("all");
              setPage(1);
            }}
            className="text-[12px] text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-background shadow-sm dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-black/5 bg-muted/50 text-[12px] font-medium text-muted-foreground dark:border-white/10">
              <tr>
                <th className="px-4 py-3">Customer & Review</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Sentiment</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {paginatedReviews.length > 0 ? (
                paginatedReviews.map((review) => (
                  <tr
                    key={review.id}
                    onClick={() => setSelectedReview(review)}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                  >
                    <td className="max-w-xs px-4 py-3.5">
                      <div className="flex items-start gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted font-medium text-[12px]">
                          {review.avatar}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{review.author}</p>
                          <p className="line-clamp-2 text-[12px] text-muted-foreground">{review.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-medium">
                        <span className="text-amber-500">★</span>
                        <span>{review.rating}.0</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <Badge
                        variant={
                          review.sentiment === "Positive"
                            ? "positive"
                            : review.sentiment === "Negative"
                            ? "negative"
                            : "muted"
                        }
                      >
                        {review.sentiment} ({review.confidence}%)
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-foreground">{review.topic}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <Badge variant={review.priority === "High" ? "negative" : "muted"}>{review.priority}</Badge>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">{review.source}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">{review.date}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" className="h-8 text-[12px] text-primary">
                        Analyze AI
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No reviews matching the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-black/5 px-4 py-3 dark:border-white/10">
          <p className="text-[12px] text-muted-foreground">
            Showing Page <span className="font-medium text-foreground">{page}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 text-[12px]"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 text-[12px]"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* AI Detail Drawer Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg overflow-y-auto bg-background p-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <h3 className="text-lg font-semibold">AI Sentiment Breakdown</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedReview(null)}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Customer summary */}
              <div className="rounded-2xl bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-foreground text-background font-medium">
                      {selectedReview.avatar}
                    </span>
                    <div>
                      <p className="font-medium text-[15px]">{selectedReview.author}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {selectedReview.source} · {selectedReview.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-semibold text-base">
                    <span>★</span>
                    <span>{selectedReview.rating}.0</span>
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-foreground italic">
                  "{selectedReview.content}"
                </p>
              </div>

              {/* AI Analysis Cards */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-black/5 p-4 dark:border-white/10">
                  <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">AI Executive Summary</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground">{selectedReview.aiSummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-black/5 p-4 dark:border-white/10">
                    <p className="text-[12px] font-medium text-muted-foreground">Sentiment Classification</p>
                    <div className="mt-2 flex items-center gap-2">
                      {selectedReview.sentiment === "Positive" ? (
                        <ThumbsUp className="size-5 text-blue-600" />
                      ) : selectedReview.sentiment === "Negative" ? (
                        <ThumbsDown className="size-5 text-red-600" />
                      ) : (
                        <Minus className="size-5 text-gray-500" />
                      )}
                      <span className="font-semibold text-[15px]">{selectedReview.sentiment}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">Confidence: {selectedReview.confidence}%</p>
                  </div>

                  <div className="rounded-2xl border border-black/5 p-4 dark:border-white/10">
                    <p className="text-[12px] font-medium text-muted-foreground">Detected Topic</p>
                    <p className="mt-2 font-semibold text-[15px] text-foreground">{selectedReview.topic}</p>
                    <Badge variant={selectedReview.priority === "High" ? "negative" : "muted"} className="mt-1">
                      {selectedReview.priority} Priority
                    </Badge>
                  </div>
                </div>

                {/* Key extracted phrases */}
                <div className="rounded-2xl border border-black/5 p-4 dark:border-white/10">
                  <p className="text-[12px] font-medium text-muted-foreground">Extracted NLP Signals</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedReview.keyPhrases.map((phrase) => (
                      <span key={phrase} className="rounded-lg bg-muted px-2.5 py-1 text-[12px] text-foreground">
                        #{phrase}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Next Action */}
                <div className="rounded-2xl bg-blue-50/50 p-4 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30">
                  <div className="flex items-center gap-2 text-primary font-medium text-[13px]">
                    <CheckCircle2 className="size-4" />
                    Recommended Next Action
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground">{selectedReview.suggestedAction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
