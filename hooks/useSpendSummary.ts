"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { toMonthly, toAnnual, daysUntil } from "@/lib/utils";
import type { Category, Subscription } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { subMonths, format, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

export interface SpendSummary {
  monthlyTotal: number;
  annualTotal: number;
  activeCount: number;
  pausedCount: number;
  cancelledCount: number;
  nextRenewal: { sub: Subscription; days: number } | null;
  categoryBreakdown: { category: Category; monthly: number; count: number }[];
  monthlySeries: { month: string; amount: number }[];
  billingRatio: { monthly: number; quarterly: number; annually: number };
  mostExpensive: Subscription | null;
  longestHeld: Subscription | null;
}

export function useSpendSummary(): SpendSummary {
  const subscriptions = useStore((s) => s.subscriptions);

  return useMemo(() => {
    const active = subscriptions.filter((s) => s.status === "Active");

    const monthlyTotal = active.reduce(
      (sum, s) => sum + toMonthly(s.amount, s.billingCycle),
      0
    );
    const annualTotal = active.reduce(
      (sum, s) => sum + toAnnual(s.amount, s.billingCycle),
      0
    );

    // Next renewal (active only, future-most-imminent)
    const upcoming = active
      .map((s) => ({ sub: s, days: daysUntil(s.nextRenewalDate) }))
      .filter((x) => x.days >= 0)
      .sort((a, b) => a.days - b.days);
    const nextRenewal = upcoming[0] ?? null;

    // Category breakdown
    const categoryBreakdown = CATEGORIES.map((category) => {
      const subs = active.filter((s) => s.category === category);
      const monthly = subs.reduce(
        (sum, s) => sum + toMonthly(s.amount, s.billingCycle),
        0
      );
      return { category, monthly, count: subs.length };
    }).filter((c) => c.count > 0);

    // 12-month series — recurring monthly-equivalent spend as a smooth baseline,
    // plus the actual lump charge for any annual/quarterly renewal landing in a month.
    const now = new Date();
    const monthlySeries = Array.from({ length: 12 }).map((_, i) => {
      const monthDate = subMonths(now, 11 - i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      let amount = 0;
      for (const s of active) {
        amount += toMonthly(s.amount, s.billingCycle);
        if (s.billingCycle !== "Monthly") {
          const renewal = new Date(s.nextRenewalDate);
          if (isWithinInterval(renewal, { start, end })) {
            // surface the real charge spike on the renewal month
            amount += s.amount - toMonthly(s.amount, s.billingCycle);
          }
        }
      }
      return { month: format(monthDate, "MMM"), amount: Math.round(amount * 100) / 100 };
    });

    const billingRatio = active.reduce(
      (acc, s) => {
        if (s.billingCycle === "Monthly") acc.monthly += 1;
        else if (s.billingCycle === "Quarterly") acc.quarterly += 1;
        else acc.annually += 1;
        return acc;
      },
      { monthly: 0, quarterly: 0, annually: 0 }
    );

    const mostExpensive =
      active.length > 0
        ? active.reduce((max, s) =>
            toMonthly(s.amount, s.billingCycle) > toMonthly(max.amount, max.billingCycle)
              ? s
              : max
          )
        : null;

    const longestHeld =
      active.length > 0
        ? active.reduce((oldest, s) =>
            new Date(s.startDate) < new Date(oldest.startDate) ? s : oldest
          )
        : null;

    return {
      monthlyTotal,
      annualTotal,
      activeCount: active.length,
      pausedCount: subscriptions.filter((s) => s.status === "Paused").length,
      cancelledCount: subscriptions.filter((s) => s.status === "Cancelled").length,
      nextRenewal,
      categoryBreakdown,
      monthlySeries,
      billingRatio,
      mostExpensive,
      longestHeld,
    };
  }, [subscriptions]);
}
