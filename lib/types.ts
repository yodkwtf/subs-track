export type Category =
  | "Streaming"
  | "SaaS"
  | "Developer Tools"
  | "Domain"
  | "Cloud"
  | "Other";

export type BillingCycle = "Monthly" | "Quarterly" | "Annually";

export type Status = "Active" | "Paused" | "Cancelled";

export interface Subscription {
  id: string;
  name: string;
  logo?: string; // emoji fallback or image url
  category: Category;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  nextRenewalDate: string; // ISO date
  startDate: string; // ISO date
  notes?: string;
  status: Status;
  url?: string;
}

export type ActivityType = "added" | "edited" | "cancelled" | "paused" | "resumed";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  subscriptionName: string;
  timestamp: string; // ISO datetime
}

export interface AiSuggestion {
  id: string;
  name: string;
  reason: string;
  potentialSaving: number;
}

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

export interface Settings {
  currency: CurrencyCode;
  reminderThreshold: 3 | 7 | 14;
}
