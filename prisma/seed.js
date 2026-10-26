const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = parseLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    if (vals.length < 5) continue;

    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim().toLowerCase()] = vals[idx] ? vals[idx].trim() : "";
    });
    rows.push(row);
  }
  return rows;
}

function parseLine(line) {
  const res = [];
  let curr = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      res.push(curr.trim().replace(/^["']|["']$/g, ""));
      curr = "";
    } else {
      curr += c;
    }
  }
  res.push(curr.trim().replace(/^["']|["']$/g, ""));
  return res;
}

async function seed() {
  console.log("🌱 Starting FeedbackOS Database Seeding...");

  // 1. Create or upsert Default Admin User
  const user = await prisma.user.upsert({
    where: { email: "admin@feedbackos.io" },
    update: {},
    create: {
      clerkUserId: "usr_demo_admin_001",
      email: "admin@feedbackos.io",
      name: "Sahil Khurana",
      role: "OWNER",
    },
  });
  console.log("✅ User created/verified:", user.name, `(${user.email})`);

  // 2. Create or find Default Business
  let business = await prisma.business.findFirst({
    where: { userId: user.id },
  });

  if (!business) {
    business = await prisma.business.create({
      data: {
        name: "The Heritage Bistro & Kitchen",
        industry: "Fine Dining & Hospitality",
        userId: user.id,
      },
    });
  }
  console.log("✅ Business created/verified:", business.name);

  // 3. Read and parse restaurant_feedback.csv
  const csvPath = path.join(process.cwd(), "restaurant_feedback.csv");
  if (!fs.existsSync(csvPath)) {
    console.error("❌ restaurant_feedback.csv not found at", csvPath);
    return;
  }

  const csvRaw = fs.readFileSync(csvPath, "utf8");
  const parsedRows = parseCSV(csvRaw);
  console.log(`📊 Found ${parsedRows.length} reviews in restaurant_feedback.csv`);

  // Clear existing feedbacks for fresh clean state
  await prisma.feedback.deleteMany({ where: { businessId: business.id } });
  await prisma.topic.deleteMany({ where: { businessId: business.id } });
  await prisma.issue.deleteMany({ where: { businessId: business.id } });
  await prisma.recommendation.deleteMany({ where: { businessId: business.id } });
  await prisma.report.deleteMany({ where: { businessId: business.id } });

  const feedbackData = parsedRows.map((r) => {
    const rating = parseInt(r.rating || "3", 10);
    const sentiment =
      r.sentiment?.toUpperCase() === "POSITIVE"
        ? "POSITIVE"
        : r.sentiment?.toUpperCase() === "NEGATIVE"
        ? "NEGATIVE"
        : rating >= 4
        ? "POSITIVE"
        : rating <= 2
        ? "NEGATIVE"
        : "NEUTRAL";

    const content = r.review_text || r.content || r.review || "";
    const authorName = r.reviewer_name || r.author || "Anonymous Customer";

    // Category mapping to topic
    let topicName = "General Dining";
    const cat = (r.category || "").toLowerCase();
    if (cat.includes("food")) topicName = "Food & Product Quality";
    else if (cat.includes("service") || cat.includes("staff")) topicName = "Customer Support & Service";
    else if (cat.includes("hygiene") || cat.includes("clean")) topicName = "Cleanliness & Sanitation";
    else if (cat.includes("ambiance") || cat.includes("experience")) topicName = "Ambiance & Atmosphere";

    const priority =
      rating <= 2 || sentiment === "NEGATIVE"
        ? rating === 1
          ? "CRITICAL"
          : "HIGH"
        : rating === 3
        ? "MEDIUM"
        : "LOW";

    const sentimentScore =
      sentiment === "POSITIVE"
        ? 0.75 + (rating === 5 ? 0.2 : 0.1)
        : sentiment === "NEGATIVE"
        ? 0.15 - (rating === 1 ? 0.1 : 0.0)
        : 0.5;

    return {
      businessId: business.id,
      authorName,
      source: "Google Reviews",
      rating,
      content,
      sentiment,
      sentimentScore,
      confidence: 0.94,
      priority,
      topics: JSON.stringify([topicName]),
      createdAt: r.date ? new Date(r.date) : new Date(),
    };
  });

  // Batch insert feedbacks
  await prisma.feedback.createMany({ data: feedbackData });
  console.log(`✅ Inserted ${feedbackData.length} live feedbacks into database!`);

  // 4. Compute and insert Topics
  const topicStats = {};
  feedbackData.forEach((f) => {
    const topics = JSON.parse(f.topics);
    topics.forEach((t) => {
      if (!topicStats[t]) {
        topicStats[t] = { count: 0, pos: 0, neg: 0, neu: 0 };
      }
      topicStats[t].count++;
      if (f.sentiment === "POSITIVE") topicStats[t].pos++;
      else if (f.sentiment === "NEGATIVE") topicStats[t].neg++;
      else topicStats[t].neu++;
    });
  });

  for (const [name, s] of Object.entries(topicStats)) {
    await prisma.topic.create({
      data: {
        businessId: business.id,
        name,
        category: "Operational Pillar",
        mentionCount: s.count,
        positivePct: Math.round((s.pos / s.count) * 100),
        negativePct: Math.round((s.neg / s.count) * 100),
        neutralPct: Math.round((s.neu / s.count) * 100),
      },
    });
  }
  console.log(`✅ Aggregated ${Object.keys(topicStats).length} topic categories in database!`);

  // 5. Seed Core Issues
  const criticalIssues = [
    {
      title: "Kitchen Food Safety & Temperature Consistency",
      description: "Severe reports of cold food, undercooked chicken, and foreign object in pasta requiring immediate kitchen audit.",
      priority: "CRITICAL",
      status: "PENDING",
      mentionCount: 16,
      trend: "Increasing",
      exampleFeedback: "The chicken was raw in the middle. Absolutely unacceptable and frankly dangerous.",
      suggestedAction: "Implement digital kitchen temperature logs before plating and enforce strict expo sign-off.",
    },
    {
      title: "Reservation Seating Delays & Wait Times",
      description: "Guests with confirmed reservations report 35-45 minute waiting times before table allocation.",
      priority: "CRITICAL",
      status: "PENDING",
      mentionCount: 14,
      trend: "Increasing",
      exampleFeedback: "Terrible experience from start to finish. Waited 45 minutes to be seated despite having a reservation.",
      suggestedAction: "Institute a 5-minute seating SLA and assign a dedicated peak-hour host lead.",
    },
    {
      title: "Dining Room & Restroom Sanitation Lapses",
      description: "Sticky tables, dirty kitchen pass window, and unstocked restrooms flagged by multiple diners.",
      priority: "HIGH",
      status: "PENDING",
      mentionCount: 9,
      trend: "Stable",
      exampleFeedback: "The place was also dirty with sticky tables and a grimy floor. Restroom had no soap.",
      suggestedAction: "Schedule mandatory 45-minute cleaning rotation checklists with supervisor sign-off.",
    },
    {
      title: "Staff Hospitality & Complaint Recovery",
      description: "Waiters and managers perceived as dismissive and unhelpful when guest issues are raised.",
      priority: "HIGH",
      status: "PENDING",
      mentionCount: 12,
      trend: "Stable",
      exampleFeedback: "When I complained, the waiter was dismissive and rude. Zero effort to fix the problem.",
      suggestedAction: "Conduct hospitality recovery training and empower front-of-house staff to offer instant comps.",
    },
  ];

  for (const iss of criticalIssues) {
    await prisma.issue.create({
      data: {
        businessId: business.id,
        ...iss,
      },
    });
  }
  console.log(`✅ Seeded ${criticalIssues.length} detected operational issues!`);

  // 6. Seed AI Action Recommendations
  const recommendations = [
    {
      category: "Immediate Actions",
      title: "Establish 5-Minute Seating SLA for Reservations",
      whyItMatters: "Reservation wait time complaints statistically drag overall ratings down by 0.4★ and directly cost repeat party bookings.",
      actionStep: "Audit host stand reservation allocations, reserve 2 overflow tables for peak rush buffer, and seat booked guests within 5 minutes.",
      priority: "CRITICAL",
      status: "Pending",
    },
    {
      category: "Immediate Actions",
      title: "Implement Expo Chef Temperature & Plating Check",
      whyItMatters: "Food safety issues (cold soup, raw chicken) represent catastrophic brand risk and invite public health scrutiny.",
      actionStep: "Mandate food temperature probing logs for all poultry and seafood before leaving the pass.",
      priority: "CRITICAL",
      status: "Pending",
    },
    {
      category: "This Week",
      title: "Rollout 45-Minute Restroom & Dining Sanitation Sweeps",
      whyItMatters: "Cleanliness ratings are a non-negotiable prerequisite for premium dining and anniversary reservations.",
      actionStep: "Mount a digital sanitation log in restrooms and assign dedicated floor bussers during Friday/Saturday rushes.",
      priority: "HIGH",
      status: "Pending",
    },
    {
      category: "This Week",
      title: "Empower Floor Staff with Instant Comp Authorization",
      whyItMatters: "When an issue occurs, immediate sincere resolution turns 1-star reviews into 5-star customer advocacy stories.",
      actionStep: "Allow floor servers to comp dessert or drinks up to $25 immediately without seeking manager approval.",
      priority: "HIGH",
      status: "Pending",
    },
    {
      category: "Positive Opportunities",
      title: "Promote Truffle Risotto & Homemade Pasta Moat",
      whyItMatters: "Your signature pasta dishes have a 98% positive sentiment score and represent your highest margin organic acquisition engine.",
      actionStep: "Feature customer testimonials of truffle risotto on Instagram and train staff to recommend it to first-time diners.",
      priority: "MEDIUM",
      status: "Pending",
    },
  ];

  for (const rec of recommendations) {
    await prisma.recommendation.create({
      data: {
        businessId: business.id,
        category: rec.category,
        title: rec.title,
        whyItMatters: rec.whyItMatters,
        actionStep: rec.actionStep,
        priority: rec.priority,
        status: "PENDING",
      },
    });
  }
  console.log(`✅ Seeded ${recommendations.length} AI action recommendations!`);

  // 7. Seed Initial Executive AI Report
  const totalCount = feedbackData.length;
  const badCount = feedbackData.filter((f) => f.sentiment === "NEGATIVE").length;
  const posCount = feedbackData.filter((f) => f.sentiment === "POSITIVE").length;
  const avgRating = (feedbackData.reduce((s, f) => s + f.rating, 0) / totalCount).toFixed(1);

  await prisma.report.create({
    data: {
      businessId: business.id,
      title: `${business.name} Executive AI Customer Intelligence Audit`,
      period: "Current Operating Period",
      summary: `${business.name} shows distinct operational polarization with an average rating of ${avgRating}/5 across ${totalCount} reviews. While culinary excellence in pasta and date-night ambiance drive high customer praise (${posCount} positive reviews), 40 negative reviews indicate critical operational breakdown in kitchen consistency, reservation wait times, and facility hygiene. Addressing these core friction corners is the single highest leverage opportunity to accelerate business growth.`,
      metrics: JSON.stringify({
        totalFeedbackCount: totalCount,
        averageRating: Number(avgRating),
        netSentimentScore: Math.round(50 + (((posCount - badCount) / totalCount) * 50)),
        topPositiveTopic: "Food & Product Quality (Pasta & Risotto)",
        topNegativeTopic: "Customer Support & Wait Times",
        badCount,
        goodCount: totalCount - badCount - posCount,
        excellentCount: posCount,
      }),
    },
  });
  console.log("✅ Seeded initial Executive AI Report!");

  // 8. Generate demo_feedbacks_list.json in project root and public folder
  const demoList = parsedRows.map((r, i) => ({
    id: i + 1,
    reviewer_name: r.reviewer_name || "Anonymous",
    rating: parseInt(r.rating || "3", 10),
    date: r.date || "2024-05-01",
    sentiment: r.sentiment || "neutral",
    category: r.category || "overall_experience",
    review_text: r.review_text || "",
  }));

  fs.writeFileSync(
    path.join(process.cwd(), "demo_feedbacks_list.json"),
    JSON.stringify(demoList, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(process.cwd(), "public", "demo-feedbacks.json"),
    JSON.stringify(demoList, null, 2),
    "utf8"
  );
  console.log("✅ Created demo_feedbacks_list.json and public/demo-feedbacks.json!");

  console.log("🎉 ALL DATABASE TABLES FULLY SEEDED AND 100% LIVE!");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("Seeding Error:", e);
  process.exit(1);
});
