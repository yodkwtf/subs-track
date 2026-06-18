"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, UserRound, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/auth-context";
import { useToast } from "@/components/ui/toast";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, signUp, continueAsGuest, configured, isAuthed, isGuest, loading } =
    useAuth();

  const [mode, setMode] = React.useState<Mode>("signin");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!loading && (isAuthed || isGuest)) router.replace("/dashboard");
  }, [loading, isAuthed, isGuest, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signUp(email.trim(), password, name.trim() || undefined);
        toast({
          title: "Account created",
          description: "If email confirmation is on, check your inbox to finish.",
        });
      } else {
        await signIn(email.trim(), password);
        toast({ title: "Welcome back" });
      }
      router.replace("/dashboard");
    } catch (err) {
      toast({
        title: mode === "signup" ? "Sign up failed" : "Sign in failed",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    router.replace("/dashboard");
  };

  return (
    <div className="ambient-bg flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-6xl px-5 py-5">
        <Link href="/" aria-label="Payora home" className="inline-flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-wordmark.svg" alt="Payora" className="h-8 w-auto" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-16">
        <Card className="glass w-full max-w-md p-6 sm:p-8">
          <h1 className="text-xl font-bold tracking-tight">
            {mode === "signin" ? "Sign in to Payora" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Welcome back. Pick up right where you left off."
              : "Sync your subscriptions across every device."}
          </p>

          {!configured && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Accounts need a quick Supabase setup (see{" "}
                <code className="rounded bg-black/20 px-1">guide.md</code>). You can still
                explore everything as a guest below.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              {submitting
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to Payora?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-primary hover:underline focus-ring"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full gap-2" onClick={handleGuest}>
            <UserRound className="h-4 w-4" />
            Continue as guest
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Guests get sample data to play with. Data stays on this device.
          </p>
        </Card>
      </main>
    </div>
  );
}
