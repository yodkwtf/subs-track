# Payora - Setup Guide

This is a complete, step-by-step setup for running Payora locally and deploying it.
Everything that needs a key or external account is covered here.

Payora works out of the box with **zero setup** in guest mode (data stays in your
browser). The steps below unlock the optional extras:

- **AI Insights**: needs an Anthropic API key.
- **Accounts + cloud sync**: needs a free Supabase project.
- **SEO / social preview**: needs your deployed site URL.

---

## 1. Prerequisites

| Tool | Version | Notes |
| ---- | ------- | ----- |
| Node.js | **20 LTS or newer** (22 LTS recommended) | https://nodejs.org/ then check with `node -v` |
| npm | comes with Node | check with `npm -v` |
| Git | any recent version | optional, for cloning |

---

## 2. Install & run locally

```bash
# from the project folder
npm install
npm run dev
```

Open http://localhost:3000. You'll land on the marketing page. Click **Try the live
demo** then **Continue as guest** to use the full app immediately with sample data.

---

## 3. Environment variables

Copy the example file and fill in only the values you need:

```bash
cp .env.example .env.local
```

`.env.local` is git-ignored, so your secrets never get committed. Restart `npm run dev`
after changing it.

| Variable | Required? | What it does |
| -------- | --------- | ------------ |
| `ANTHROPIC_API_KEY` | optional | Powers the "Analyse my subscriptions" AI panel. |
| `NEXT_PUBLIC_SUPABASE_URL` | optional | Enables real accounts + cloud sync. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | optional | Public Supabase key (safe to ship; protected by RLS). |
| `NEXT_PUBLIC_SITE_URL` | optional | Your production URL, used for SEO/Open Graph absolute links. |

---

## 4. AI Insights (Anthropic), optional

1. Go to https://console.anthropic.com/ and sign in.
2. Open **Settings -> API keys -> Create key**. Copy it (starts with `sk-ant-`).
3. Add it to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
4. Restart the dev server. The AI panel on the dashboard will now work.

> The app uses the `claude-sonnet-4-6` model server-side via `app/api/ai-suggest`.
> Without a key, every other feature still works; only the AI panel is disabled.

---

## 5. Accounts & cloud sync (Supabase), optional

Supabase gives every user their own login and stores their data in the cloud. The free
tier is plenty for a side project.

### 5.1 Create the project

1. Go to https://supabase.com/ and sign in (GitHub login is easiest).
2. Click **New project**. Pick a name (e.g. `payora`), set a strong database password
   (save it somewhere), and choose the region closest to you.
3. Wait about 2 minutes for it to provision.

### 5.2 Grab your keys

1. In the project, open **Project Settings (gear icon) -> API**.
2. Copy these two values into `.env.local`:
   - **Project URL** goes to `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys -> `anon` `public`** goes to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdxyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 5.3 Create the data table (with security)

Payora stores each user's whole dataset as a single JSON row, protected by Row Level
Security so users can only read/write their own row.

1. In Supabase, open **SQL Editor -> New query**.
2. Paste and **Run** this:

```sql
-- One JSON blob of subscriptions/activity/settings per user.
create table if not exists public.subscriptions_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Lock it down: a user can only touch their own row.
alter table public.subscriptions_data enable row level security;

create policy "Users manage their own data"
  on public.subscriptions_data
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 5.4 Configure email auth

1. Open **Authentication -> Sign In / Providers** and make sure **Email** is enabled.
2. For easy local testing, turn **off** "Confirm email" (Authentication -> Providers ->
   Email -> *Confirm email*). New sign-ups can then log in immediately without an inbox.
   - Leave it **on** for production if you want verified emails. With it on, users must
     click the link in their email before their first sign-in.
3. (Optional) Under **Authentication -> URL Configuration**, set the **Site URL** to
   `http://localhost:3000` for local dev, and your real domain for production.

### 5.5 Try it

Restart `npm run dev`, go to **Sign in -> Create an account**, and register. Your data now
syncs to Supabase and follows you across devices and browsers. The amber "guest" banner
disappears once you're signed in.

---

## 6. Deploy (Netlify)

The repo ships with a `netlify.toml`, so importing it is the whole setup. The build
command, the official Next.js runtime (which turns the AI API route into a serverless
function), and the Node version are already configured. **The only thing you add by hand
is environment variables.**

1. Push the project to a GitHub repository.
2. Go to https://app.netlify.com/, click **Add new site -> Import an existing project**,
   pick your Git provider, and select the repo. Netlify reads `netlify.toml` and
   auto-detects Next.js, so leave the build settings as-is and click **Deploy**.
3. Add your environment variables in **Site configuration -> Environment variables**
   (the same keys from your `.env.local`):
   - `ANTHROPIC_API_KEY` (optional, for the AI panel)
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional, for accounts)
   - `NEXT_PUBLIC_SITE_URL` set to your Netlify URL, e.g. `https://your-site.netlify.app`
4. Trigger a redeploy (**Deploys -> Trigger deploy -> Deploy site**) so the new env vars
   are baked in. If you added them before the first deploy, you can skip this.
5. In Supabase, under **Authentication -> URL Configuration**, add your Netlify domain to
   **Site URL** / **Redirect URLs** so logins work in production.

> The app works on Netlify with no env vars at all (guest mode only). Add the keys above
> to unlock AI Insights and real accounts.
>
> Do **not** add `output: "export"` to `next.config.mjs` for Netlify: static export would
> disable the `/api/ai-suggest` serverless function. The default build is correct.

---

## 7. Troubleshooting

| Symptom | Fix |
| ------- | --- |
| "Accounts aren't set up yet" notice on the login page | `NEXT_PUBLIC_SUPABASE_*` vars are missing or the dev server wasn't restarted after editing `.env.local`. |
| Sign-up succeeds but can't sign in | "Confirm email" is on: check your inbox, or disable it (step 5.4). |
| AI panel says key not configured | Add `ANTHROPIC_API_KEY` to `.env.local` and restart. |
| Data not syncing | Confirm the SQL in 5.3 ran and the RLS policy exists. Check the browser console for Supabase errors. |
| Social preview image is blank | Set `NEXT_PUBLIC_SITE_URL` and redeploy; the image is generated at `/opengraph-image`. |

---

## 8. Where things live

```
app/                  routes
  (app)/              protected app (dashboard, subscriptions, analytics, settings, add)
  login/              sign in / sign up / guest
  page.tsx            public landing page
  opengraph-image.tsx generated 1200x630 social image
components/auth/      auth context, route gate, cloud sync
lib/supabase.ts       Supabase client (null when unconfigured)
lib/cloud.ts          load/save the per-user JSON blob
lib/store.ts          Zustand store (local cache + guest storage)
```
