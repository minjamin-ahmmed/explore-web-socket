"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ChatLayout } from "@/components/chat/chat-layout";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Redirecting to login…
        </span>
      </main>
    );
  }

  return (
    <main>
      <ChatLayout />
    </main>
  );
}
