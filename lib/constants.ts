export const SITE = {
  name: "FeedbackOS",
  tagline: "Don't just collect feedback. Turn it into growth.",
  usp: "FeedbackOS doesn't just tell businesses what customers said — it tells them what to do next.",
  positioning: "AI Customer Intelligence for Growing Businesses.",
  primaryMessage:
    "Understand your customers. Prioritize what matters. Know what to do next.",
} as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/feedback", label: "Feedback", icon: "feedback" },
  { href: "/dashboard/insights", label: "Insights", icon: "insights" },
  { href: "/dashboard/issues", label: "Issues", icon: "issues" },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: "recommendations" },
  { href: "/dashboard/growth-coach", label: "AI Growth Coach", icon: "coach" },
  { href: "/dashboard/reports", label: "Reports", icon: "reports" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
] as const;

export const NAV_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
] as const;

export const PROBLEM_POINTS = [
  {
    title: "Reviews pile up",
    body: "Hundreds of comments across Google, delivery apps, and in-store notes — and no single place to make sense of them.",
  },
  {
    title: "Channels stay scattered",
    body: "Feedback arrives from too many sources. Patterns hide in the noise until a regular already left.",
  },
  {
    title: "Complaints get missed",
    body: "The important issues are rarely the loudest. A delayed delivery thread can sit unread for weeks.",
  },
  {
    title: "No clear next step",
    body: "Owners see ratings move, but not what to fix first, or whether last week's change actually helped.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Collect",
    body: "Bring reviews and comments into one workspace. FeedbackOS organizes the raw input so nothing important is left in a spreadsheet.",
  },
  {
    step: "02",
    title: "Understand",
    body: "AI reads sentiment, topics, and confidence on every review — so you see how customers feel, not just what they typed.",
  },
  {
    step: "03",
    title: "Prioritize",
    body: "Issues are ranked by frequency, negativity, and business impact. The queue tells you what deserves attention today.",
  },
  {
    step: "04",
    title: "Act",
    body: "Get recommended actions, weekly summaries, and an AI Growth Coach that turns insight into an operating plan.",
  },
] as const;

export const FEATURES = [
  {
    title: "AI Sentiment Analysis",
    body: "Understand how customers feel across every review — with confidence, not guesswork.",
  },
  {
    title: "Topic Detection",
    body: "Identify recurring concerns like wait times, packaging, or staff — without reading every comment.",
  },
  {
    title: "Smart Priority",
    body: "Know which issues deserve attention first, based on volume, sentiment, and trend.",
  },
  {
    title: "AI Executive Summary",
    body: "Get the big picture instantly: what moved, what slipped, and what to watch this week.",
  },
  {
    title: "AI Recommendations",
    body: "Know what actions to take. Each insight comes with a clear next step, not another chart.",
  },
  {
    title: "AI Growth Coach",
    body: "Ask questions about your customers and business. Get answers grounded in your own feedback.",
  },
] as const;

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    cadence: "forever",
    description: "Start seeing sentiment on a small monthly sample.",
    featured: false,
    features: [
      "50 reviews / month",
      "Basic sentiment analysis",
      "Overall sentiment score",
    ],
    cta: "Start free",
    href: "/get-started",
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹999–₹1,999",
    cadence: "per month",
    description: "The operating system for review-heavy local businesses.",
    featured: true,
    features: [
      "Higher review limits",
      "Topic detection",
      "Priority ranking",
      "Weekly summaries",
      "Analytics dashboard",
    ],
    cta: "Choose Growth",
    href: "/get-started",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹3,999+",
    cadence: "per month",
    description: "Advanced AI for teams that run on customer intelligence.",
    featured: false,
    features: [
      "Advanced AI recommendations",
      "Trend analysis",
      "Multi-source upload",
      "Advanced dashboard",
      "AI Growth Coach",
      "Team access",
    ],
    cta: "Talk to us",
    href: "/get-started",
  },
] as const;
