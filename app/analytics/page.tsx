"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { BillingRatioCard, CalloutCards } from "@/components/analytics/AnalyticsExtras";

const SpendChart = dynamic(
  () => import("@/components/analytics/SpendChart").then((m) => m.SpendChart),
  { ssr: false, loading: () => <Skeleton className="h-80 rounded-2xl" /> }
);
const CategoryDonut = dynamic(
  () => import("@/components/analytics/CategoryDonut").then((m) => m.CategoryDonut),
  { ssr: false, loading: () => <Skeleton className="h-72 rounded-2xl" /> }
);

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Understand where your recurring money goes.
      </p>

      <SpendChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryDonut />
        <BillingRatioCard />
      </div>

      <CalloutCards />
    </div>
  );
}
