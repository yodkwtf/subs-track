"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

function FullScreenLoader() {
  return (
    <div className="ambient-bg flex min-h-screen flex-col items-center justify-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" width={48} height={48} className="animate-pulse" />
      <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
    </div>
  );
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthed, isGuest, loading } = useAuth();
  const router = useRouter();
  const allowed = isAuthed || isGuest;

  React.useEffect(() => {
    if (!loading && !allowed) router.replace("/login");
  }, [loading, allowed, router]);

  if (loading || !allowed) return <FullScreenLoader />;
  return <>{children}</>;
}
