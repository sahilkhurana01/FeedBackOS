# FeedbackOS — AI Customer Intelligence & Growth OS

> **Don't just collect customer feedback. Turn it into business growth.**

FeedbackOS is a full-stack, AI-powered Customer Intelligence platform designed for review-driven businesses (restaurants, cafés, salons, hospitality, retail, and service brands). It ingests review feedback, analyzes sentiment velocity, pinpoints critical operational friction corners, and automatically constructs actionable turnaround playbooks to boost ratings and revenue.

---

## 🌟 Key Features

- **📊 Live Operational Overview:** Real-time customer sentiment velocity, 1–5 star rating distributions, topic frequencies, and critical issue alerts.
- **⚡ AI Strategic Audit & 1-Click Full Analysis:** Evaluates all database reviews in seconds. When feedback has negative trends, it isolates the **Core Friction Corners** (Food Quality, Staff Hospitality, Wait Times, Hygiene) with concrete operational fixes and revenue projections.
- **🔍 Feedback Explorer:** Real-time filterable review explorer with keyword search, rating filtering, and sentiment breakdown.
- **⚠️ Issues Detection:** Auto-clustered operational friction points prioritized by volume, urgency, and rating impact.
- **🎯 AI Action Center:** Prioritized operational directives with status tracking (`Pending`, `In Progress`, `Completed`).
- **💬 AI Growth Coach:** Conversational advisory agent with direct database context injection.
- **📈 Executive Reports & Email Delivery:** Generates board-ready monthly executive intelligence audits and emails them directly to your inbox.
- **🔒 Clerk Authentication & Dynamic Onboarding:** Clean user profile and multi-business workspace management.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19, TypeScript)
- **Database & ORM:** Prisma ORM with SQLite (`dev.db`) — zero external database configuration required
- **AI Engine:** LLM-powered feedback analysis & Growth Coach
- **Styling & Components:** Tailwind CSS, Radix UI, Framer Motion, Lucide Icons
- **Visualizations:** Recharts (Rating Bar, Sentiment Donut, Sentiment Trend, Topic Bar, Feedback Volume)
- **Auth:** Clerk (`@clerk/nextjs`)

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sahilkhurana01/FeedBackOS.git
cd FeedBackOS
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your API keys in `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

DATABASE_URL="file:./dev.db"
GROQ_API_KEY=gsk_...
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
npm run db:seed
```
This populates the database with 80+ customer reviews from `restaurant_feedback.csv`, detected issues, recommendations, and initial reports.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Deploy to Render

FeedbackOS is pre-configured for **Render Web Service** deployment with the included [`render.yaml`](./render.yaml).

### Method A: Connect GitHub Repository on Render (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect `sahilkhurana01/FeedBackOS`.
4. Configure the service settings:
   - **Name:** `feedbackos`
   - **Language / Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. In the **Environment Variables** section, add:
   - `DATABASE_URL` = `file:./dev.db`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = your Clerk publishable key
   - `CLERK_SECRET_KEY` = your Clerk secret key
   - `GROQ_API_KEY` = your AI API key
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/onboarding`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/onboarding`
   - `NODE_VERSION` = `20.18.0`
6. Click **Deploy Web Service**. Render will automatically run the build, sync and seed the database, and launch your live application!

---

## 📂 Project Structure

```
├── app/
│   ├── api/                   # 17 REST API endpoints (overview, feedback, issues, coach, reports, ai)
│   ├── dashboard/             # All live dashboard pages (overview, feedback, issues, coach, etc.)
│   ├── onboarding/            # Dynamic business onboarding flow
│   ├── sign-in/ & sign-up/    # Clerk authentication routes
│   └── page.tsx               # Marketing landing page
├── components/
│   ├── charts/                # Recharts live chart visualizations
│   ├── dashboard/             # Shell, topbar, sidebar, upload modal, AI analyzer modal
│   ├── feedback/              # Filterable review explorer
│   ├── growth-coach/          # Conversational AI coach interface
│   ├── issues/                # Detected friction issues grid
│   ├── recommendations/       # AI Action Center
│   └── reports/               # Executive intelligence reports
├── lib/
│   ├── coach-agent.ts         # AI conversational growth coach engine
│   ├── full-analyzer-engine.ts# Deep-dive analysis & core friction corner diagnosis
│   ├── groq-client.ts         # Live LLM analysis client
│   ├── priority-engine.ts     # Operational issue clustering & scoring
│   ├── recommendations-engine.ts # Prioritized action generator
│   └── prisma.ts              # Prisma ORM singleton client
├── prisma/
│   ├── schema.prisma          # Database models (User, Business, Feedback, Issue, Report, etc.)
│   └── seed.js                # Database seeder script
├── public/                    # Static assets & demo CSV/JSON files
├── demo_feedbacks_list.json   # 80-review demo dataset in root
├── restaurant_feedback.csv    # Raw CSV reviews dataset
└── render.yaml                # Render Blueprint deployment config
```

---

## 📄 License

MIT © [Sahil Khurana](https://github.com/sahilkhurana01)
