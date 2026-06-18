# 💸 Payora - Subscription Tracker

Track every subscription, see where your money goes, and kill the waste. Payora gives
you a premium dashboard for recurring payments, renewal reminders, spend analytics, and
AI-powered cancellation suggestions.

Works instantly as a **guest** (data stays on your device), or **sign in** to sync your
data across devices via Supabase.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v3** + shadcn/ui-style primitives (Radix)
- **Framer Motion** for micro-interactions & page transitions
- **Zustand** (+ `persist`) for client state and guest storage
- **Supabase** for auth + per-user cloud data (optional)
- **next-themes** for dark/light mode (dark by default, no flash)
- **Recharts** for spend visualizations
- **date-fns** for renewal math
- **simple-icons** + **react-icons** for brand logos
- **@anthropic-ai/sdk** (`claude-sonnet-4-6`) for AI cancellation suggestions

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), hit **Try the live demo**, and
**Continue as guest** to explore with sample data right away.

To enable AI Insights and real accounts, follow [guide.md](./guide.md): it covers the
Anthropic key and the (free) Supabase setup step by step.

## Features

- **Landing page**: public, modern marketing page; every app route is protected behind it.
- **Auth**: email/password accounts via Supabase, plus a one-click **guest mode** with mock data.
- **Dashboard**: hero stats, color-coded upcoming renewals, recent activity, AI insights, quick-add.
- **Subscriptions**: fuzzy search, filter (category / status / billing), sort, grid/list toggle, slide-over detail with full CRUD + pause/resume/archive. Duplicate names are blocked.
- **Analytics**: real 12-month spend trend (built from each subscription's start date), category donut, billing cadence, "most expensive" & "longest held".
- **AI Insights**: `POST /api/ai-suggest` sends your list to Claude server-side and returns dismissible cancellation suggestions with estimated annual savings.
- **Settings**: profile (display name), default currency (14 currencies with flags, INR by default), reminder threshold, JSON import/export, clear-all. Every change confirms with a toast.
- **Brand logos**: 160+ colored Simple Icons, plus uncolored react-icons fallbacks (Amazon, Microsoft, etc.) for brands Simple Icons no longer ships.

## Data & sync

- **Guests** use `localStorage` (Zustand `persist`); data stays on the device.
- **Signed-in users** get their full dataset stored as a single JSON row in Supabase,
  protected by Row Level Security, loaded on sign-in and saved (debounced) on change.
- If Supabase isn't configured, the app gracefully runs in guest-only mode.

## Accessibility & performance

- Skip-to-content link, focus trap in dialogs/sheets (Radix), `aria-*` labels, keyboard-navigable.
- `prefers-reduced-motion` respected via Framer Motion and a global CSS fallback.
- Charts and the AI panel are lazy-loaded with `next/dynamic`; fonts via `next/font`.
- SEO-ready: rich metadata, a generated 1200x630 Open Graph image, and a branded favicon.

## Project structure

```
app/            landing (/), login, (app) protected routes, api/ai-suggest, generated icons/OG
components/     auth, brand, layout, dashboard, subscriptions, analytics, ai, ui (primitives)
lib/            types, constants, utils, store, supabase, cloud, brand resolution
hooks/          useSubscriptions, useSpendSummary
```

See [guide.md](./guide.md) for full setup and deployment instructions.
