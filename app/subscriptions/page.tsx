"use client";

import { SubscriptionList } from "@/components/subscriptions/SubscriptionList";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Every recurring payment in one place. Click any card for details.
      </p>
      <SubscriptionList />
    </div>
  );
}
