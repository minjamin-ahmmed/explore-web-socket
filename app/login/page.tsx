"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password: password.trim() });
      router.replace("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong during login.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Preparing chat…</span>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 text-foreground">
      <motion.div
        className="app-shell-card relative w-full max-w-md overflow-hidden rounded-3xl border border-border/70 p-6 shadow-soft-elevated sm:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.45),transparent_55%)]" />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Welcome back!
            </h1>
           
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-muted-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="mt-2 h-10 rounded-full bg-primary px-6 text-xs font-semibold uppercase tracking-[0.18em]"
              disabled={isSubmitting || !email.trim() || !password.trim()}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          {error && (
            <p className="text-[0.7rem] font-medium text-destructive">
              {error}
            </p>
          )}
        </div>
      </motion.div>
    </main>
  );
}


