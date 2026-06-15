# 🧾 SubTrack — Subscription Tracker

A premium, privacy-first subscription tracker. Monitor renewals, visualize spend, and get AI-powered cancellation suggestions. All data lives in your browser via `localStorage` — no backend or auth required.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v3** + shadcn/ui-style primitives (Radix)
- **Framer Motion** — micro-interactions & page transitions
- **Zustand** (+ `persist`) — client state in `localStorage`
- **next-themes** — dark/light mode (dark by default, no flash)
- **Recharts** — spend visualizations
- **date-fns** — renewal math
- **@anthropic-ai/sdk** — AI cancellation suggestions

## Getting started

```bash
npm install

# Add your Anthropic key for the AI Insights feature
# (the app works fully without it — only "Analyse my subscriptions" needs it)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app seeds 8 example subscriptions on first load.

## Features

- **Dashboard** — hero stats, color-coded upcoming renewals, recent activity feed, AI insights, quick-add FAB.
- **Subscriptions** — search (fuzzy), filter (category / status / billing), sort, grid⇄list toggle, slide-over detail panel with full CRUD + pause/resume/archive.
- **Analytics** — 12-month spend bar chart, category donut, billing cadence, "most expensive" & "longest held" callouts.
- **AI Insights** — `POST /api/ai-suggest` sends your list to Claude (`claude-sonnet-4-6`) server-side and returns dismissible cancellation suggestions with estimated annual savings.
- **Settings** — currency, reminder threshold, JSON import/export, clear-all with confirmation.

## Accessibility & performance

- WCAG-minded: skip-to-content link, focus trap in dialogs/sheets (Radix), `aria-*` labels, keyboard-navigable, color never the sole indicator.
- `prefers-reduced-motion` respected via Framer Motion's `useReducedMotion` and a global CSS fallback.
- Charts and the AI panel are lazy-loaded with `next/dynamic`; fonts via `next/font`.

## Project structure

```
app/            routes (dashboard, subscriptions, add, analytics, settings) + api/ai-suggest
components/     layout, dashboard, subscriptions, analytics, ai, ui (primitives)
lib/            types, constants, utils, zustand store
hooks/          useSubscriptions, useSpendSummary
```
