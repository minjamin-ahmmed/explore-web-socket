"use client";

import * as React from "react";
import type { ChatMessage } from "@/context/chat-context";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  message: ChatMessage;
  isOwn: boolean;
  showTimestamp?: boolean;
};

export function MessageBubble({
  message,
  isOwn,
  showTimestamp = true,
}: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-xs rounded-2xl px-3 py-2 text-[0.8rem] shadow-sm sm:max-w-sm md:max-w-md",
          isOwn
            ? "rounded-br-none bg-primary text-primary-foreground"
            : "rounded-bl-none bg-secondary text-secondary-foreground"
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {showTimestamp && (
          <div className="mt-1 flex items-center justify-end gap-1 text-[0.65rem] text-muted-foreground/80">
            <span>{time}</span>
            {isOwn && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1 py-px",
                  "bg-primary-soft/40 text-[0.6rem] font-semibold uppercase tracking-wide"
                )}
              >
                {message.status}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


