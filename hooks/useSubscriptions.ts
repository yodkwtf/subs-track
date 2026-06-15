"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import type { Category, Status, BillingCycle, Subscription } from "@/lib/types";
import { daysUntil, fuzzyMatch } from "@/lib/utils";

export type SortKey = "name" | "amount" | "renewal";
export type ViewMode = "grid" | "list";

export interface SubscriptionFilters {
  search?: string;
  category?: Category | "All";
  status?: Status | "All";
  billingCycle?: BillingCycle | "All";
  sort?: SortKey;
  sortDir?: "asc" | "desc";
}

export function useSubscriptions() {
  const subscriptions = useStore((s) => s.subscriptions);
  const addSubscription = useStore((s) => s.addSubscription);
  const updateSubscription = useStore((s) => s.updateSubscription);
  const deleteSubscription = useStore((s) => s.deleteSubscription);
  const archiveSubscription = useStore((s) => s.archiveSubscription);
  const setStatus = useStore((s) => s.setStatus);

  return {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    archiveSubscription,
    setStatus,
  };
}

export function useFilteredSubscriptions(filters: SubscriptionFilters): Subscription[] {
  const subscriptions = useStore((s) => s.subscriptions);

  return useMemo(() => {
    const {
      search = "",
      category = "All",
      status = "All",
      billingCycle = "All",
      sort = "renewal",
      sortDir = "asc",
    } = filters;

    let result = subscriptions.filter((sub) => {
      if (category !== "All" && sub.category !== category) return false;
      if (status !== "All" && sub.status !== status) return false;
      if (billingCycle !== "All" && sub.billingCycle !== billingCycle) return false;
      if (search && !fuzzyMatch(search, sub.name)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sort === "name") cmp = a.name.localeCompare(b.name);
      else if (sort === "amount") cmp = a.amount - b.amount;
      else if (sort === "renewal")
        cmp = daysUntil(a.nextRenewalDate) - daysUntil(b.nextRenewalDate);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [subscriptions, filters]);
}
