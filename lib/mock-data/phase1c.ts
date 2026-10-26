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
  source: "Google" | "Zomato" | "In-store" | "Swiggy" | "TripAdvisor";
  content: string;
  aiSummary: string;
  suggestedAction: string;
  keyPhrases: string[];
}

export interface IssueItem {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  mentions: number;
  trend: "Increasing" | "Stable" | "Decreasing";
  sentimentScore: number; // 0-100
  exampleFeedback: string[];
  recommendedAction: string;
  impactScore: string;
  affectedCustomersPct: number;
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: "Immediate Actions" | "This Week" | "Monitor" | "Positive Opportunities";
  issue: string;
  whyItMatters: string;
  recommendedAction: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  expectedImpact: string;
  effort: "Low" | "Medium" | "High";
}

export interface ReportItem {
  id: string;
  title: string;
  period: string;
  type: "Monthly Summary" | "Weekly Snapshot" | "Quarterly Analysis";
  createdAt: string;
  summary: string;
  sentimentScore: number;
  totalReviewsAnalyzed: number;
  topPositiveTopic: string;
  topNegativeTopic: string;
  status: "Ready" | "Generating";
}

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "REV-101",
    author: "Sarah Jenkins",
    avatar: "SJ",
    rating: 2,
    sentiment: "Negative",
    confidence: 94,
    topic: "Wait times",
    priority: "High",
    date: "Aug 14, 2026",
    source: "Google",
    content: "Waited 35 minutes for two oat milk lattes on Saturday morning. Staff seemed overwhelmed and didn't update us on the order delay.",
    aiSummary: "Long wait times during peak Saturday hours combined with lack of proactive communication from staff.",
    suggestedAction: "Schedule an extra barista on Saturday 10am-2pm shift and add order status display board.",
    keyPhrases: ["waited 35 minutes", "staff overwhelmed", "no update"],
  },
  {
    id: "REV-102",
    author: "David Chen",
    avatar: "DC",
    rating: 5,
    sentiment: "Positive",
    confidence: 98,
    topic: "Oat-milk drinks",
    priority: "Low",
    date: "Aug 13, 2026",
    source: "Zomato",
    content: "Hands down the best iced oat vanilla latte in town! Perfectly balanced espresso and silky texture every single time.",
    aiSummary: "High praise for specialty oat milk coffee quality and consistent beverage preparation.",
    suggestedAction: "Promote iced oat vanilla latte as signature menu item in marketing campaigns.",
    keyPhrases: ["best iced oat vanilla latte", "perfectly balanced", "silky texture"],
  },
  {
    id: "REV-103",
    author: "Elena Rostova",
    avatar: "ER",
    rating: 3,
    sentiment: "Neutral",
    confidence: 89,
    topic: "Packaging",
    priority: "Medium",
    date: "Aug 13, 2026",
    source: "Swiggy",
    content: "Food arrived fast and coffee was still hot, but the takeaway cup lid was slightly loose and leaked into the delivery bag.",
    aiSummary: "Prompt delivery with hot beverage, but lid fit issues led to minor takeaway bag spillage.",
    suggestedAction: "Inspect batch of 12oz cup lids and consider double-sealing delivery beverages.",
    keyPhrases: ["arrived fast", "lid loose", "leaked into bag"],
  },
  {
    id: "REV-104",
    author: "Marcus Vance",
    avatar: "MV",
    rating: 5,
    sentiment: "Positive",
    confidence: 96,
    topic: "Staff warmth",
    priority: "Low",
    date: "Aug 12, 2026",
    source: "Google",
    content: "The cashier Priya remembered my name and drink order from yesterday! Such a friendly neighborhood cafe vibe.",
    aiSummary: "Exceptional personalized service and staff hospitality driving customer loyalty.",
    suggestedAction: "Commend Priya during weekly team standup for creating memorable customer touchpoints.",
    keyPhrases: ["remembered my name", "friendly neighborhood vibe", "personalized service"],
  },
  {
    id: "REV-105",
    author: "Amit Patel",
    avatar: "AP",
    rating: 1,
    sentiment: "Negative",
    confidence: 97,
    topic: "Wait times",
    priority: "High",
    date: "Aug 11, 2026",
    source: "Swiggy",
    content: "Delivery took over an hour! Sandwich was cold and the iced drink was completely watered down. Terrible experience.",
    aiSummary: "Extended delivery delay resulting in degraded food temperature and melted beverage ice.",
    suggestedAction: "Partner with Swiggy priority delivery fleet or restrict delivery radius during rush hours.",
    keyPhrases: ["took over an hour", "sandwich was cold", "watered down"],
  },
  {
    id: "REV-106",
    author: "Jessica Taylor",
    avatar: "JT",
    rating: 4,
    sentiment: "Positive",
    confidence: 91,
    topic: "Loyalty app",
    priority: "Low",
    date: "Aug 10, 2026",
    source: "In-store",
    content: "Love the new digital loyalty card scanner! Super smooth checkout. Wish there were gluten-free pastry options though.",
    aiSummary: "Positive reception for new loyalty app, with feature request for dietary menu expansion.",
    suggestedAction: "Pass gluten-free request to kitchen team for seasonal menu evaluation.",
    keyPhrases: ["smooth checkout", "digital loyalty card", "gluten-free options"],
  },
  {
    id: "REV-107",
    author: "Rohan Gupta",
    avatar: "RG",
    rating: 2,
    sentiment: "Negative",
    confidence: 93,
    topic: "Packaging",
    priority: "High",
    date: "Aug 09, 2026",
    source: "Zomato",
    content: "Third time this month that hot coffee arrived with a crushed cup top. Packaging needs a serious upgrade.",
    aiSummary: "Repeat complaint regarding fragile cup construction causing damage during transit.",
    suggestedAction: "Switch to reinforced wall paper cups for all hot takeaway orders.",
    keyPhrases: ["third time this month", "crushed cup top", "packaging upgrade"],
  },
  {
    id: "REV-108",
    author: "Chloe Bennett",
    avatar: "CB",
    rating: 5,
    sentiment: "Positive",
    confidence: 99,
    topic: "Staff warmth",
    priority: "Low",
    date: "Aug 08, 2026",
    source: "TripAdvisor",
    content: "Charming atmosphere, great music, and delicious avocado sourdough toast. Highly recommend for remote work mornings!",
    aiSummary: "Strong endorsement of cafe ambience, menu taste, and workspace suitability.",
    suggestedAction: "Highlight breakfast toast options and high-speed Wi-Fi on Instagram page.",
    keyPhrases: ["charming atmosphere", "avocado sourdough toast", "remote work"],
  },
];

export const MOCK_ISSUES: IssueItem[] = [
  {
    id: "ISS-01",
    title: "Weekend Queue & Wait Times",
    category: "Operations",
    priority: "High",
    mentions: 54,
    trend: "Increasing",
    sentimentScore: 24,
    exampleFeedback: [
      "Waited 35 minutes for two oat milk lattes on Saturday morning.",
      "Line was out the door and only one register was open at 11 AM.",
      "Orders took forever during Sunday brunch shift."
    ],
    recommendedAction: "Add a 2nd barista during peak hours (10 AM - 2 PM Saturdays) and introduce mobile order pickup lane.",
    impactScore: "High (Affects ~18% of weekend visits)",
    affectedCustomersPct: 18,
  },
  {
    id: "ISS-02",
    title: "Takeaway Cup Packaging Spillage",
    category: "Packaging",
    priority: "High",
    mentions: 33,
    trend: "Increasing",
    sentimentScore: 31,
    exampleFeedback: [
      "Takeaway cup lid was slightly loose and leaked into the delivery bag.",
      "Third time this month hot coffee arrived with a crushed cup top.",
      "Lids pop off easily when carrying multiple drinks."
    ],
    recommendedAction: "Switch to press-fit ergonomic lids and reinforced double-wall paper cups.",
    impactScore: "Medium (Affects 12% of delivery orders)",
    affectedCustomersPct: 12,
  },
  {
    id: "ISS-03",
    title: "Delivery Transit Delays",
    category: "Logistics",
    priority: "Medium",
    mentions: 28,
    trend: "Stable",
    sentimentScore: 38,
    exampleFeedback: [
      "Delivery took over an hour and iced drink was watered down.",
      "Rider spent 20 minutes finding the pickup location."
    ],
    recommendedAction: "Geofence pickup instructions for Swiggy/Zomato riders and use insulated thermal sleeves.",
    impactScore: "Medium (Affects 8% of delivery orders)",
    affectedCustomersPct: 8,
  },
  {
    id: "ISS-04",
    title: "Limited Gluten-Free Options",
    category: "Menu",
    priority: "Low",
    mentions: 14,
    trend: "Decreasing",
    sentimentScore: 52,
    exampleFeedback: [
      "Wish there were gluten-free pastry options to pair with oat lattes.",
      "Great coffee but no GF bakery items available."
    ],
    recommendedAction: "Introduce 2 certified gluten-free pastries from local bakery partner.",
    impactScore: "Low (Opportunity to boost pastry attach rate)",
    affectedCustomersPct: 4,
  },
];

export const MOCK_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: "REC-101",
    title: "Deploy Peak Hour Barista Support",
    category: "Immediate Actions",
    issue: "Weekend Queue & Wait Times",
    whyItMatters: "54 mentions this month. Unattended weekend queues are lowering repeat customer retention by 14%.",
    recommendedAction: "Shift one afternoon team member to Saturday 10:30 AM – 2:00 PM and enable Express Cold Brew tap.",
    priority: "High",
    status: "Pending",
    expectedImpact: "+6 pts in overall sentiment score within 2 weeks",
    effort: "Low",
  },
  {
    id: "REC-102",
    title: "Upgrade Hot Beverage Lids & Packaging",
    category: "Immediate Actions",
    issue: "Takeaway Cup Packaging Spillage",
    whyItMatters: "Spillage accounts for 33 negative reviews. Delivery customers are giving 1-star reviews for preventable leaks.",
    recommendedAction: "Transition inventory to Snap-Lock tamper-evident lids for all 12oz & 16oz hot cups.",
    priority: "High",
    status: "In Progress",
    expectedImpact: "Eliminates ~90% of delivery leak complaints",
    effort: "Medium",
  },
  {
    id: "REC-103",
    title: "Optimize Delivery Logistics Radius",
    category: "This Week",
    issue: "Delivery Transit Delays",
    whyItMatters: "Orders travelling >4km show a 40% higher negative sentiment rate due to melted ice and lukewarm food.",
    recommendedAction: "Cap maximum delivery radius to 3.5km during peak lunch and weekend hours.",
    priority: "Medium",
    status: "Pending",
    expectedImpact: "Reduces transit delay complaints by 45%",
    effort: "Low",
  },
  {
    id: "REC-104",
    title: "Introduce Gluten-Free Bakery Selection",
    category: "Positive Opportunities",
    issue: "Limited Gluten-Free Options",
    whyItMatters: "14 explicit requests from high-value coffee buyers who currently skip food items.",
    recommendedAction: "Partner with WholesomeBakes for pre-packaged GF almond muffins and brownies.",
    priority: "Low",
    status: "Pending",
    expectedImpact: "+₹15,000 monthly food attach revenue",
    effort: "Low",
  },
  {
    id: "REC-105",
    title: "Feature 'Staff Warmth' in Social Campaign",
    category: "Positive Opportunities",
    issue: "Customer Loyalty & Brand Delight",
    whyItMatters: "Priya and staff friendliness were highlighted in 29 glowing reviews.",
    recommendedAction: "Create a 'Meet Your Barista' Instagram reel series highlighting customer favorite team members.",
    priority: "Low",
    status: "Completed",
    expectedImpact: "Boosts community engagement & local brand affinity",
    effort: "Low",
  },
];

export const MOCK_GROWTH_COACH_PROMPTS = [
  "What are customers unhappy about?",
  "What should I fix first this week?",
  "What are customers loving most?",
  "Summarize this month in 3 bullet points.",
  "Give me a step-by-step weekend action plan."
];

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
  insights?: {
    type: "issue" | "recommendation" | "stat";
    title: string;
    detail: string;
  }[];
}

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "coach",
    text: "Hello Alex! I've analyzed 486 reviews for **Northstar Café** from the last 30 days. Your overall sentiment is strong at **78/100**, but Saturday wait times and takeaway packaging are your two main growth bottlenecks. How can I help you take action today?",
    timestamp: "10:00 AM",
  },
];

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: "REP-2026-08",
    title: "August 2026 Monthly Intelligence Report",
    period: "Aug 01, 2026 - Aug 14, 2026",
    type: "Monthly Summary",
    createdAt: "Aug 14, 2026",
    summary: "Northstar Café maintained a 78% positive sentiment index across 486 reviews. Top driver remains Oat-milk beverage quality (98% positive sentiment). Critical operational fix required for Saturday morning queue management.",
    sentimentScore: 78,
    totalReviewsAnalyzed: 486,
    topPositiveTopic: "Oat-milk drinks",
    topNegativeTopic: "Wait times",
    status: "Ready",
  },
  {
    id: "REP-2026-07",
    title: "July 2026 Executive Summary",
    period: "Jul 01, 2026 - Jul 31, 2026",
    type: "Monthly Summary",
    createdAt: "Aug 01, 2026",
    summary: "July total review volume grew 14% month-over-month. Introduction of loyalty app scanner received 91% satisfaction rating. Staff warmth mentioned in 42 positive reviews.",
    sentimentScore: 74,
    totalReviewsAnalyzed: 512,
    topPositiveTopic: "Staff warmth",
    topNegativeTopic: "Packaging",
    status: "Ready",
  },
  {
    id: "REP-2026-W32",
    title: "Week 32 Operational Snapshot",
    period: "Aug 07, 2026 - Aug 13, 2026",
    type: "Weekly Snapshot",
    createdAt: "Aug 13, 2026",
    summary: "Weekly review volume hit 118 reviews. Negative sentiment dropped from 22% to 18% following drink recipe standardisation.",
    sentimentScore: 80,
    totalReviewsAnalyzed: 118,
    topPositiveTopic: "Oat-milk drinks",
    topNegativeTopic: "Wait times",
    status: "Ready",
  },
];
