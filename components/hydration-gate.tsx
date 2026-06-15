"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Blocks rendering of persisted-state-dependent UI until the Zustand store has
 * rehydrated from localStorage, preventing hydration mismatches and layout shift.
 */
export function HydrationGate({ children }: { children: React.ReactNode }) {
  const hydrated = useStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return <>{children}</>;
}
