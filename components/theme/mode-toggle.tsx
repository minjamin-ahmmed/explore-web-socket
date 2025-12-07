"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;

  const isDark = current === "dark";

  return (
    <Button
      aria-label="Toggle theme"
      variant="ghost"
      size="icon"
      className={cn(
        "relative rounded-full border border-border/60 bg-background/70 shadow-sm hover:bg-accent"
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span
        className={cn(
          "pointer-events-none h-4 w-4 transform-gpu rounded-full bg-gradient-to-tr from-primary-soft to-primary/90 shadow-sm transition-all",
          isDark ? "translate-x-0 opacity-100" : "translate-x-0 opacity-100"
        )}
      />
    </Button>
  );
}


