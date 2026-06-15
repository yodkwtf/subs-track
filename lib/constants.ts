import type { Category, BillingCycle, Status, CurrencyCode, Subscription } from "./types";

export const CATEGORIES: Category[] = [
  "Streaming",
  "SaaS",
  "Developer Tools",
  "Domain",
  "Cloud",
  "Other",
];

export const BILLING_CYCLES: BillingCycle[] = ["Monthly", "Quarterly", "Annually"];

export const STATUSES: Status[] = ["Active", "Paused", "Cancelled"];

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
];

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

export const REMINDER_THRESHOLDS: (3 | 7 | 14)[] = [3, 7, 14];

/** Category accent colors (Tailwind-friendly hex) for badges & charts */
export const CATEGORY_COLORS: Record<Category, string> = {
  Streaming: "#6366F1",
  SaaS: "#22D3EE",
  "Developer Tools": "#A78BFA",
  Domain: "#F59E0B",
  Cloud: "#34D399",
  Other: "#94A3B8",
};

/** Emoji fallbacks used when no logo is supplied */
export const CATEGORY_EMOJI: Record<Category, string> = {
  Streaming: "🎬",
  SaaS: "🧩",
  "Developer Tools": "🛠️",
  Domain: "🌐",
  Cloud: "☁️",
  Other: "📦",
};

/** Known brand emoji to make the seed data feel real */
export const BRAND_EMOJI: Record<string, string> = {
  netflix: "🍿",
  "amazon prime": "📦",
  "github pro": "🐙",
  github: "🐙",
  "vercel pro": "▲",
  vercel: "▲",
  figma: "🎨",
  spotify: "🎧",
  linear: "📐",
  notion: "📝",
  openai: "🤖",
  claude: "✳️",
};

export const SEED_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    category: "Streaming",
    amount: 15.99,
    currency: "USD",
    billingCycle: "Monthly",
    nextRenewalDate: "2026-06-22",
    startDate: "2023-01-12",
    status: "Active",
    url: "https://netflix.com/account",
    notes: "Standard 1080p plan.",
  },
  {
    id: "2",
    name: "Amazon Prime",
    category: "Streaming",
    amount: 139,
    currency: "USD",
    billingCycle: "Annually",
    nextRenewalDate: "2026-11-10",
    startDate: "2021-11-10",
    status: "Active",
    url: "https://amazon.com/prime",
  },
  {
    id: "3",
    name: "GitHub Pro",
    category: "Developer Tools",
    amount: 4,
    currency: "USD",
    billingCycle: "Monthly",
    nextRenewalDate: "2026-06-18",
    startDate: "2022-03-01",
    status: "Active",
    url: "https://github.com/settings/billing",
  },
  {
    id: "4",
    name: "Vercel Pro",
    category: "Cloud",
    amount: 20,
    currency: "USD",
    billingCycle: "Monthly",
    nextRenewalDate: "2026-07-01",
    startDate: "2023-08-15",
    status: "Active",
    url: "https://vercel.com/account",
  },
  {
    id: "5",
    name: "Figma",
    category: "SaaS",
    amount: 12,
    currency: "USD",
    billingCycle: "Monthly",
    nextRenewalDate: "2026-06-30",
    startDate: "2022-06-30",
    status: "Active",
    url: "https://figma.com/settings",
  },
  {
    id: "6",
    name: "myapp.io",
    category: "Domain",
    amount: 18,
    currency: "USD",
    billingCycle: "Annually",
    nextRenewalDate: "2027-01-15",
    startDate: "2024-01-15",
    status: "Active",
    logo: "🌐",
  },
  {
    id: "7",
    name: "Spotify",
    category: "Streaming",
    amount: 9.99,
    currency: "USD",
    billingCycle: "Monthly",
    nextRenewalDate: "2026-06-25",
    startDate: "2020-05-20",
    status: "Active",
    url: "https://spotify.com/account",
  },
  {
    id: "8",
    name: "Linear",
    category: "SaaS",
    amount: 8,
    currency: "USD",
    billingCycle: "Monthly",
    nextRenewalDate: "2026-07-05",
    startDate: "2024-02-10",
    status: "Paused",
    url: "https://linear.app/settings",
  },
];

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/subscriptions", label: "Subscriptions", icon: "CreditCard" },
  { href: "/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const;
