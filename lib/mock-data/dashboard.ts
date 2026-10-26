export const DEMO_USER = {
  name: "Alex Rivera",
  role: "Owner",
  initials: "AR",
} as const;

export const OVERVIEW_KPIS = [
  {
    label: "Overall sentiment",
    value: 78,
    decimals: 0,
    suffix: "",
    hint: "Stable vs last month",
    question: "How do guests feel overall?",
  },
  {
    label: "Total reviews",
    value: 486,
    decimals: 0,
    suffix: "",
    hint: "Last 30 days",
    question: "How much feedback came in?",
  },
  {
    label: "Positive",
    value: 64,
    decimals: 0,
    suffix: "%",
    hint: "+4 pts",
    question: "What share is clearly happy?",
  },
  {
    label: "Negative",
    value: 18,
    decimals: 0,
    suffix: "%",
    hint: "-2 pts",
    question: "What share needs attention?",
  },
  {
    label: "Average rating",
    value: 4.3,
    decimals: 1,
    suffix: "",
    hint: "Out of 5",
    question: "Where does the score sit?",
  },
  {
    label: "Critical issues",
    value: 3,
    decimals: 0,
    suffix: "",
    hint: "Need action this week",
    question: "What cannot wait?",
  },
] as const;

export const SENTIMENT_TREND = [
  { week: "W1", positive: 58, negative: 24, neutral: 18 },
  { week: "W2", positive: 61, negative: 22, neutral: 17 },
  { week: "W3", positive: 59, negative: 23, neutral: 18 },
  { week: "W4", positive: 64, negative: 20, neutral: 16 },
  { week: "W5", positive: 66, negative: 19, neutral: 15 },
  { week: "W6", positive: 64, negative: 18, neutral: 18 },
] as const;

export const SENTIMENT_DISTRIBUTION = [
  { name: "Positive", value: 64, fill: "#0071e3" },
  { name: "Neutral", value: 18, fill: "#86868b" },
  { name: "Negative", value: 18, fill: "#d70015" },
] as const;

export const TOPIC_FREQUENCY = [
  { topic: "Wait times", mentions: 54 },
  { topic: "Oat-milk drinks", mentions: 41 },
  { topic: "Packaging", mentions: 33 },
  { topic: "Staff warmth", mentions: 29 },
  { topic: "Loyalty app", mentions: 14 },
] as const;

export const RATING_DISTRIBUTION = [
  { rating: "5", count: 198 },
  { rating: "4", count: 142 },
  { rating: "3", count: 78 },
  { rating: "2", count: 41 },
  { rating: "1", count: 27 },
] as const;

export const FEEDBACK_VOLUME = [
  { day: "Jul 14", reviews: 11 },
  { day: "Jul 16", reviews: 14 },
  { day: "Jul 18", reviews: 9 },
  { day: "Jul 20", reviews: 18 },
  { day: "Jul 22", reviews: 22 },
  { day: "Jul 24", reviews: 16 },
  { day: "Jul 26", reviews: 19 },
  { day: "Jul 28", reviews: 13 },
  { day: "Jul 30", reviews: 21 },
  { day: "Aug 1", reviews: 17 },
  { day: "Aug 3", reviews: 24 },
  { day: "Aug 5", reviews: 15 },
] as const;

export const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Weekend wait times rose",
    body: "54 mentions this month. Still the top issue.",
    time: "2h ago",
  },
  {
    id: "n2",
    title: "New cluster: cold takeaway cups",
    body: "21 recent reviews. Worth a look this week.",
    time: "Yesterday",
  },
  {
    id: "n3",
    title: "Weekly summary is ready",
    body: "Northstar Café — last 7 days of demo feedback.",
    time: "Mon",
  },
] as const;

export const OVERVIEW_SUMMARY =
  "Guests keep praising the oat-milk drinks and the team, while weekend queues and a few cold takeaway cups are the main reasons scores dip. Fixing Saturday staffing between 11–2 would address the loudest cluster of reviews.";
