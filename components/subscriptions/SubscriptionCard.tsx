"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Subscription } from "@/lib/types";
import { CategoryBadge, StatusBadge } from "./badges";
import {
  daysUntil,
  formatCurrency,
  renewalUrgency,
  resolveLogo,
  urgencyLabel,
  cn,
} from "@/lib/utils";

const URGENCY_TEXT: Record<string, string> = {
  overdue: "text-red-400",
  red: "text-red-400",
  yellow: "text-amber-400",
  green: "text-muted-foreground",
};

interface Props {
  sub: Subscription;
  view: "grid" | "list";
  threshold: number;
  onClick: () => void;
}

export function SubscriptionCard({ sub, view, threshold, onClick }: Props) {
  const days = daysUntil(sub.nextRenewalDate);
  const urgency = renewalUrgency(sub.nextRenewalDate, threshold);
  const cycleLabel =
    sub.billingCycle === "Monthly" ? "mo" : sub.billingCycle === "Annually" ? "yr" : "qtr";

  if (view === "list") {
    return (
      <motion.button
        layout
        onClick={onClick}
        whileHover={{ x: 4 }}
        className="glass flex w-full items-center gap-4 rounded-xl p-3.5 text-left focus-ring"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl" aria-hidden>
          {resolveLogo(sub)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{sub.name}</span>
            <StatusBadge status={sub.status} />
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <CategoryBadge category={sub.category} />
          </div>
        </div>
        <div className="hidden text-right sm:block">
          <p className={cn("text-xs font-medium", URGENCY_TEXT[urgency])}>
            {sub.status === "Active" ? urgencyLabel(days) : "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold tabular-nums">{formatCurrency(sub.amount, sub.currency)}</p>
          <p className="text-xs text-muted-foreground">/{cycleLabel}</p>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      layout
      onClick={onClick}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="glass group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5 text-left focus-ring"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl" aria-hidden>
          {resolveLogo(sub)}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold">{sub.name}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <CategoryBadge category={sub.category} />
          <StatusBadge status={sub.status} />
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-border/50 pt-4">
        <div>
          <p className="text-xl font-bold tabular-nums">
            {formatCurrency(sub.amount, sub.currency)}
          </p>
          <p className="text-xs text-muted-foreground">per {sub.billingCycle.toLowerCase()}</p>
        </div>
        {sub.status === "Active" && (
          <p className={cn("text-xs font-medium", URGENCY_TEXT[urgency])}>
            {urgencyLabel(days)}
          </p>
        )}
      </div>
    </motion.button>
  );
}
