"use client";

import * as React from "react";
import { subscribeToConnectionStatus, getConnectionStatus } from "@/lib/socket";
import { cn } from "@/lib/utils";

export function ConnectionIndicator() {
  const [status, setStatus] = React.useState(getConnectionStatus());

  React.useEffect(() => {
    const unsubscribe = subscribeToConnectionStatus((newStatus) => {
      setStatus(newStatus);
    });
    return unsubscribe;
  }, []);

  const statusConfig = {
    connecting: {
      label: "Connecting...",
      color: "bg-yellow-500",
      pulse: true,
    },
    connected: {
      label: "Connected",
      color: "bg-green-500",
      pulse: false,
    },
    disconnected: {
      label: "Disconnected",
      color: "bg-gray-500",
      pulse: false,
    },
    error: {
      label: "Connection Error",
      color: "bg-red-500",
      pulse: false,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[0.65rem] font-medium">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          config.color,
          config.pulse && "animate-pulse"
        )}
        aria-label={config.label}
      />
      <span className="text-muted-foreground">{config.label}</span>
    </div>
  );
}

