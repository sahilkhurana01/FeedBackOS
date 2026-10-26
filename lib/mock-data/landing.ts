export const DEMO_BUSINESS = {
  name: "Northstar Café",
  location: "Demo workspace",
} as const;

export const PREVIEW_KPIS = [
  { label: "Overall sentiment", value: 78, suffix: "", display: "78", hint: "Stable" },
  { label: "Total reviews", value: 486, suffix: "", display: "486", hint: "30 days" },
  { label: "Positive", value: 64, suffix: "%", display: "64%", hint: "+4 pts" },
  { label: "Negative", value: 18, suffix: "%", display: "18%", hint: "-2 pts" },
  { label: "Average rating", value: 4.3, suffix: "", display: "4.3", hint: "of 5" },
  { label: "Critical issues", value: 3, suffix: "", display: "3", hint: "Need action" },
] as const;

export const SENTIMENT_TREND = [
  { week: "W1", positive: 58, negative: 24, neutral: 18 },
  { week: "W2", positive: 61, negative: 22, neutral: 17 },
  { week: "W3", positive: 59, negative: 23, neutral: 18 },
  { week: "W4", positive: 64, negative: 20, neutral: 16 },
  { week: "W5", positive: 66, negative: 19, neutral: 15 },
  { week: "W6", positive: 64, negative: 18, neutral: 18 },
] as const;

export const TOP_TOPICS = [
  { name: "Weekend wait times", mentions: 54, sentiment: "negative" as const },
  { name: "Oat-milk drinks", mentions: 41, sentiment: "positive" as const },
  { name: "Takeaway packaging", mentions: 33, sentiment: "mixed" as const },
  { name: "Staff warmth", mentions: 29, sentiment: "positive" as const },
] as const;

export const CRITICAL_ISSUES = [
  {
    title: "Weekend wait times",
    priority: "High",
    mentions: 54,
    trend: "Rising",
  },
  {
    title: "Cold takeaway cups",
    priority: "High",
    mentions: 21,
    trend: "New",
  },
  {
    title: "Loyalty app glitches",
    priority: "Medium",
    mentions: 14,
    trend: "Stable",
  },
] as const;

export const RECOMMENDATION_SHOWCASE = {
  problem: "Delivery delays",
  priority: "High",
  why: "Repeated negative feedback is affecting customer experience.",
  actions: [
    "Analyze peak-hour delivery bottlenecks.",
    "Increase capacity during high-demand periods.",
    "Send proactive delivery updates.",
  ],
} as const;

export const AI_SUMMARY =
  "Guests keep praising the oat-milk drinks and the team, while weekend queues and a few cold takeaway cups are the main reasons scores dip. Fixing Saturday staffing between 11–2 would address the loudest cluster of reviews.";
