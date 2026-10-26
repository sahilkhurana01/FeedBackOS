export interface ExecutiveReportData {
  reportId: string;
  monthYear: string;
  businessName: string;
  totalFeedbackCount: number;
  overallSentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  netSentimentScore: number;
  averageRating: number;
  positiveDriver: {
    title: string;
    description: string;
    positivePercentage: number;
  };
  frictionCluster: {
    title: string;
    description: string;
    negativeMentions: number;
  };
  executiveSummary: string;
  topActionRecommendations: Array<{
    title: string;
    timeframe: string;
    impact: string;
  }>;
}

export function generateExecutiveReport(
  month = "August 2026",
  businessName = "Northstar Café"
): ExecutiveReportData {
  return {
    reportId: `rpt_${Date.now()}`,
    monthYear: month,
    businessName,
    totalFeedbackCount: 486,
    overallSentiment: "POSITIVE",
    netSentimentScore: 64,
    averageRating: 4.6,
    positiveDriver: {
      title: "Oat-Milk & Artisanal Beverages",
      description: "98% positive sentiment across 41 explicitly categorized coffee reviews.",
      positivePercentage: 98,
    },
    frictionCluster: {
      title: "Saturday Afternoon Rush Queues",
      description: "54 mentions of wait times exceeding 35 minutes on Saturday afternoons.",
      negativeMentions: 54,
    },
    executiveSummary: `${businessName} recorded 486 customer reviews in ${month}, maintaining a strong 64% net positive sentiment. Product quality and barista hospitality continue to drive top ratings, while peak weekend wait times represent the primary operational friction area.`,
    topActionRecommendations: [
      {
        title: "Add Dedicated Saturday Rush Barista",
        timeframe: "Immediate",
        impact: "+0.4 Rating Lift",
      },
      {
        title: "Implement Order Check Bag Stickers",
        timeframe: "This Week",
        impact: "Zero Missing Items",
      },
      {
        title: "Launch Loyalty Program for Specialty Drinks",
        timeframe: "Opportunity",
        impact: "+14% Repeat Rate",
      },
    ],
  };
}
