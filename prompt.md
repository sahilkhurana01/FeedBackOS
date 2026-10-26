# FeedbackOS --- Cursor Master Build Prompt

## Project

Build **FeedbackOS**, a premium AI-powered Customer Intelligence SaaS
platform.

### Core tagline

> Don't just collect feedback. Turn it into growth.

### Core USP

> FeedbackOS doesn't just tell businesses what customers said --- it
> tells them what to do next.

------------------------------------------------------------------------

# IMPORTANT DEVELOPMENT STRATEGY

Build this project **incrementally and strictly in phases**.

## Current phase

We are starting with **UI/UX ONLY**.

Do NOT implement the backend, database, authentication logic, AI, APIs,
file processing, or real data processing yet.

The first objective is to create a complete, polished,
production-quality frontend prototype with realistic mock data.

After the UI/UX is completed and approved, development will continue
phase-by-phase:

1.  UI/UX
2.  Authentication with Clerk
3.  Database with PostgreSQL + Prisma
4.  Feedback upload
5.  Python NLP service
6.  Sentiment analysis
7.  Topic detection
8.  Priority engine
9.  Groq AI summaries
10. AI recommendations
11. AI Growth Coach
12. Reports
13. Testing/security
14. Deployment

**Never skip ahead to a later phase unless explicitly instructed.**

------------------------------------------------------------------------

# FINAL TECHNOLOGY STACK

Do not replace these technologies without explicit permission.

## Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Framer Motion
-   Lucide React

## Charts

-   Recharts

## Authentication --- later phase

-   Clerk

## Backend --- later phase

-   Node.js
-   Express.js
-   TypeScript

## Database --- later phase

-   PostgreSQL
-   Prisma ORM

## AI / LLM --- later phase

-   Groq API

## NLP / ML --- later phase

-   Python
-   FastAPI
-   Hugging Face Transformers
-   pandas

------------------------------------------------------------------------

# PRODUCT POSITIONING

FeedbackOS is designed for review-heavy businesses:

### Primary customers

-   Restaurants
-   Cafes
-   Salons
-   Spas
-   Clinics
-   Gyms
-   Boutique hotels

### Future customers

-   D2C brands
-   E-commerce sellers
-   Shopify stores
-   Amazon/Flipkart sellers
-   Retail chains

The product should feel like a real B2B SaaS startup, not a college
project.

------------------------------------------------------------------------

# DESIGN DIRECTION

The UI/UX is extremely important.

Create a **sexy, cool, premium, modern, minimalistic, professional,
highly usable SaaS interface**.

The product should feel custom-designed for FeedbackOS.

## Visual characteristics

-   Premium
-   Minimal
-   Modern
-   Clean
-   Confident
-   Intelligent
-   Data-focused
-   User-friendly
-   Spacious
-   Strong typography
-   Excellent visual hierarchy

Use a restrained color palette with a distinctive FeedbackOS accent.

Support both:

-   Light mode
-   Dark mode

Dark mode should look especially polished.

Do NOT make the design look like:

-   A generic admin template
-   Bootstrap
-   A standard college project
-   A generic AI dashboard
-   A copied SaaS template

------------------------------------------------------------------------

# ANIMATION REQUIREMENTS

Use **Framer Motion**.

Animations should be smooth, fast, subtle, and purposeful.

Implement:

-   Page transitions
-   Section reveal animations
-   Card stagger animations
-   Button hover/press states
-   Sidebar transitions
-   Modal animations
-   Dropdown animations
-   Chart entrance animations
-   KPI count-up animations
-   Skeleton loading animations
-   Upload interaction animations
-   Toast animations
-   Expand/collapse animations
-   Hover micro-interactions

Avoid excessive animations.

The goal is:

> "Wow, this feels premium."

Not:

> "Everything is moving."

Respect `prefers-reduced-motion`.

------------------------------------------------------------------------

# UX PRINCIPLES

Every screen should answer:

1.  What am I looking at?
2.  Why does it matter?
3.  What can I do next?

Use clear:

-   Empty states
-   Loading states
-   Error states
-   Success states
-   Tooltips
-   Confirmation states

Avoid unnecessary complexity.

The user should understand the dashboard without needing instructions.

------------------------------------------------------------------------

# BRAND

Product name:

**FeedbackOS**

Possible positioning:

> AI Customer Intelligence for Growing Businesses.

Primary message:

> Understand your customers. Prioritize what matters. Know what to do
> next.

------------------------------------------------------------------------

# PHASE 1 --- UI/UX ONLY

## Goal

Create the complete frontend experience using **mock data**.

No real backend.

No database.

No Clerk.

No Groq.

No Python.

No API calls.

No real authentication.

No real file processing.

Use clean local mock data/services where required.

The UI must already look and behave like the finished product.

------------------------------------------------------------------------

# PROJECT STRUCTURE

Use a clean Next.js architecture.

Suggested structure:

``` text
feedbackos/
├── app/
│   ├── page.tsx
│   ├── (marketing)/
│   ├── (auth-placeholder)/
│   └── dashboard/
│       ├── page.tsx
│       ├── feedback/
│       ├── insights/
│       ├── issues/
│       ├── recommendations/
│       ├── growth-coach/
│       ├── reports/
│       └── settings/
│
├── components/
│   ├── ui/
│   ├── marketing/
│   ├── dashboard/
│   ├── charts/
│   ├── feedback/
│   └── shared/
│
├── lib/
│   ├── mock-data/
│   ├── utils.ts
│   └── constants.ts
│
├── public/
│
└── styles/
```

Adapt this structure if necessary, but keep the project modular.

------------------------------------------------------------------------

# STEP 1 --- DESIGN SYSTEM

Before building pages, establish the design system.

Create:

-   Typography scale
-   Spacing system
-   Border radius
-   Shadows
-   Background surfaces
-   Card styles
-   Button variants
-   Badge variants
-   Input styles
-   Table styles
-   Modal styles
-   Tooltip styles
-   Chart styles

Use shadcn/ui components wherever appropriate.

Create reusable components instead of duplicating styles.

------------------------------------------------------------------------

# STEP 2 --- LANDING PAGE

Create a premium startup landing page.

Sections:

## Navbar

Include:

-   FeedbackOS logo/wordmark
-   Product
-   Features
-   How it works
-   Pricing
-   Sign in
-   Get started

Navbar should become visually compact/sticky on scroll.

------------------------------------------------------------------------

## Hero

Headline:

> Turn Customer Feedback Into Business Growth.

Subheadline:

> FeedbackOS uses AI to understand what your customers are saying,
> identify what matters most, and tell you what to do next.

Primary CTA:

> Start Analyzing Feedback

Secondary CTA:

> Explore Dashboard

Add a beautiful animated dashboard preview.

The hero should immediately communicate:

**Feedback → AI Analysis → Business Action**

------------------------------------------------------------------------

# STEP 3 --- PROBLEM SECTION

Explain the problem visually.

Examples:

-   Hundreds of reviews
-   Multiple feedback channels
-   Important complaints getting missed
-   Owners don't know what to fix first

Then transition into:

> FeedbackOS turns feedback overload into clear business actions.

------------------------------------------------------------------------

# STEP 4 --- HOW IT WORKS

Create a 4-step visual flow:

``` text
1. Collect
2. Understand
3. Prioritize
4. Act
```

Each step should have:

-   Icon
-   Short explanation
-   Subtle animation

------------------------------------------------------------------------

# STEP 5 --- PRODUCT PREVIEW

Create a highly polished dashboard preview on the landing page.

Show:

-   Overall sentiment
-   Review count
-   Sentiment chart
-   Top topics
-   Critical issues
-   AI recommendations

This should look like a real SaaS product screenshot, but implemented as
live UI.

------------------------------------------------------------------------

# STEP 6 --- FEATURES

Create feature cards for:

### AI Sentiment Analysis

Understand how customers feel.

### Topic Detection

Identify recurring customer concerns.

### Smart Priority

Know which issues deserve attention first.

### AI Executive Summary

Get the big picture instantly.

### AI Recommendations

Know what actions to take.

### AI Growth Coach

Ask questions about your customers and business.

Use elegant icons and hover interactions.

------------------------------------------------------------------------

# STEP 7 --- AI RECOMMENDATION SHOWCASE

This is a key differentiator.

Create a visually impressive section showing:

### Problem

Delivery delays

### Priority

High

### Why it matters

Repeated negative feedback is affecting customer experience.

### Recommended actions

1.  Analyze peak-hour delivery bottlenecks.
2.  Increase capacity during high-demand periods.
3.  Send proactive delivery updates.

Make this section feel like the AI is actively helping a business owner.

------------------------------------------------------------------------

# STEP 8 --- PRICING PAGE/SECTION

Create:

## Free

₹0

-   50 reviews/month
-   Basic sentiment analysis
-   Overall sentiment score

## Growth

₹999--₹1,999/month

-   Higher review limits
-   Topic detection
-   Priority ranking
-   Weekly summaries
-   Analytics dashboard

## Pro

₹3,999+/month

-   Advanced AI recommendations
-   Trend analysis
-   Multi-source upload
-   Advanced dashboard
-   AI Growth Coach
-   Team access

Clearly highlight Growth as the recommended plan.

Do not implement payments yet.

------------------------------------------------------------------------

# STEP 9 --- DASHBOARD UI

Create the authenticated dashboard experience using mock data.

## Main layout

Sidebar:

-   Overview
-   Feedback
-   Insights
-   Issues
-   Recommendations
-   AI Growth Coach
-   Reports
-   Settings

Top navigation:

-   Search
-   Notifications
-   Business name
-   User profile placeholder

------------------------------------------------------------------------

# STEP 10 --- OVERVIEW DASHBOARD

Create KPI cards:

-   Overall Sentiment
-   Total Reviews
-   Positive %
-   Negative %
-   Average Rating
-   Critical Issues

Example mock values can be used.

Clearly mark them as application data through the UI context, not as
real-world claims.

------------------------------------------------------------------------

# STEP 11 --- INTERACTIVE CHARTS

Use **Recharts**.

Implement:

### Sentiment Trend

Interactive line chart.

### Sentiment Distribution

Interactive donut/pie chart.

### Topic Frequency

Interactive bar chart.

### Rating Distribution

Interactive chart.

### Feedback Volume

Time-series chart.

Charts must have:

-   Tooltips
-   Legends where useful
-   Responsive sizing
-   Hover states
-   Smooth entrance animations
-   Clean labels

Avoid chart overload.

Every chart should answer a business question.

------------------------------------------------------------------------

# STEP 12 --- FEEDBACK EXPLORER

Create a polished feedback table.

Columns:

-   Review
-   Rating
-   Sentiment
-   Confidence
-   Topic
-   Priority
-   Date
-   Source

Add filters:

-   Sentiment
-   Topic
-   Priority
-   Rating
-   Date
-   Source

Add:

-   Search
-   Pagination
-   Detail drawer/modal

Clicking a review should show its detailed AI analysis.

Use mock data only.

------------------------------------------------------------------------

# STEP 13 --- ISSUES PAGE

Show detected business issues.

Example:

### Delivery Delays

High priority 42 mentions Negative trend

### Customer Support

High priority 31 mentions Negative trend

### Product Quality

Low priority Mostly positive

Each issue card should show:

-   Frequency
-   Sentiment
-   Trend
-   Priority
-   Example feedback
-   Recommended next step

------------------------------------------------------------------------

# STEP 14 --- RECOMMENDATIONS PAGE

Create an Action Center.

Categories:

-   Immediate Actions
-   This Week
-   Monitor
-   Positive Opportunities

Each recommendation:

-   Issue
-   Why it matters
-   Recommended action
-   Priority
-   Status

Statuses:

-   Pending
-   In Progress
-   Completed

Make the action center feel useful rather than decorative.

------------------------------------------------------------------------

# STEP 15 --- AI GROWTH COACH UI

Create a beautiful conversational AI interface.

This is UI only.

Use mock responses.

Suggested prompt chips:

-   What are customers unhappy about?
-   What should I fix first?
-   What are customers loving?
-   Summarize this month.
-   Give me an action plan.

The interface should feel premium and focused.

Include:

-   Conversation history
-   User messages
-   AI messages
-   Typing indicator
-   Suggested prompts
-   Input box
-   Send button

Do not connect Groq yet.

------------------------------------------------------------------------

# STEP 16 --- REPORTS UI

Create a reports page.

Show:

-   Monthly summary
-   Sentiment overview
-   Top issues
-   Top topics
-   Recommendations

Include UI for:

-   Generate report
-   View report
-   Export report

The actual report generation can remain mocked.

------------------------------------------------------------------------

# STEP 17 --- SETTINGS UI

Create:

-   Business profile
-   Account
-   Preferences
-   Appearance
-   Notifications
-   Subscription

Do not implement real persistence yet.

------------------------------------------------------------------------

# STEP 18 --- EMPTY STATES

Design beautiful empty states for:

-   No feedback
-   No issues
-   No recommendations
-   No reports
-   No AI conversations

Each empty state should explain what the user should do next.

Example:

> No feedback yet.

> Upload your first batch of customer reviews and FeedbackOS will show
> you what your customers are really saying.

CTA:

> Upload Feedback

------------------------------------------------------------------------

# STEP 19 --- RESPONSIVE DESIGN

The application must be excellent on:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

Do not simply shrink desktop layouts.

For mobile:

-   Use bottom sheets/drawers where appropriate
-   Convert sidebar into navigation drawer
-   Make tables responsive
-   Stack KPI cards intelligently
-   Make charts readable
-   Keep primary actions accessible

------------------------------------------------------------------------

# STEP 20 --- ACCESSIBILITY

Implement:

-   Semantic HTML
-   Keyboard navigation
-   Focus states
-   Accessible buttons
-   Accessible form labels
-   Good contrast
-   Reduced-motion support
-   Screen-reader-friendly controls

------------------------------------------------------------------------

# STEP 21 --- MOCK DATA

Create realistic mock data for:

-   Reviews
-   Sentiments
-   Topics
-   Issues
-   Recommendations
-   KPI values
-   Chart data
-   AI summaries

Do not use fake data that looks like actual customer claims from real
businesses.

Use fictional/demo business information.

Example demo business:

**Northstar Café**

------------------------------------------------------------------------

# STEP 22 --- CODE QUALITY

Use:

-   TypeScript strictly
-   Reusable components
-   Clean naming
-   Small focused components
-   No unnecessary duplication
-   Proper folder structure
-   ESLint
-   Prettier

Avoid giant page components.

Extract reusable components.

------------------------------------------------------------------------

# STEP 23 --- PERFORMANCE

Do not sacrifice performance for animations.

Use:

-   Lazy loading where useful
-   Efficient rendering
-   Optimized images
-   Minimal client components where possible
-   Proper memoization only where useful

Do not over-engineer.

------------------------------------------------------------------------

# STEP 24 --- FINAL UI/UX QUALITY CHECK

Before finishing Phase 1, inspect every page.

Verify:

-   Consistent spacing
-   Consistent typography
-   Consistent components
-   No broken layouts
-   No horizontal overflow
-   Responsive charts
-   Responsive tables
-   Smooth animations
-   Good loading states
-   Good empty states
-   Good hover states
-   Good keyboard navigation
-   Dark mode
-   Mobile experience

The entire product should feel like one cohesive design system.

------------------------------------------------------------------------

# IMPORTANT: WORKING METHOD

Do not generate the entire application in one huge step.

Work sequentially.

## Start now with ONLY:

### Phase 1A

-   Initialize Next.js project
-   Configure TypeScript
-   Configure Tailwind
-   Configure shadcn/ui
-   Configure Framer Motion
-   Configure Lucide
-   Configure Recharts
-   Create the design system
-   Create the global layout
-   Create the FeedbackOS brand identity
-   Create the landing page

STOP after Phase 1A.

Explain what was created and wait for approval before moving to Phase
1B.

------------------------------------------------------------------------

## Phase 1B

After approval:

-   Dashboard shell
-   Sidebar
-   Topbar
-   Overview dashboard
-   Mock KPI cards
-   Mock charts

STOP and wait for approval.

------------------------------------------------------------------------

## Phase 1C

After approval:

-   Feedback Explorer
-   Issues
-   Recommendations
-   AI Growth Coach
-   Reports
-   Settings

STOP and wait for approval.

------------------------------------------------------------------------

## Phase 1D

After approval:

-   Responsive optimization
-   Dark mode refinement
-   Animation refinement
-   Accessibility
-   Empty states
-   Loading states
-   Error states
-   Final UI polish

STOP.

Only after the entire UI/UX phase is approved should backend
implementation begin.

------------------------------------------------------------------------

# BACKEND PHASE --- DO NOT START YET

The following will be implemented later:

1.  Clerk authentication
2.  PostgreSQL
3.  Prisma
4.  Business/user relationships
5.  Feedback persistence
6.  CSV processing
7.  Python FastAPI service
8.  Hugging Face sentiment model
9.  Topic detection
10. Priority engine
11. Groq integration
12. Executive summaries
13. AI recommendations
14. AI Growth Coach
15. Reports
16. Subscription logic
17. Security
18. Testing
19. Deployment

Do not implement any of these during the initial UI/UX phase.

------------------------------------------------------------------------

# FINAL INSTRUCTION

Treat FeedbackOS as a **real startup SaaS product**.

Prioritize:

**Product quality \> number of features**

**UX \> unnecessary complexity**

**Actionable insights \> generic AI output**

**Polished design \> excessive decoration**

**Trustworthy analysis \> exaggerated AI claims**

Build it so that when someone opens FeedbackOS, their immediate reaction
is:

> "This looks like a real product I could use and pay for."

Start with **Phase 1A only**.
