"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/context/chat-context";
import { useAuth } from "@/context/auth-context";
import { getSocketClient } from "@/lib/socket";

type MessageInputProps = {
  onSend?: (value: string) => void;
};

// Target user ID to chat with
const TARGET_USER_ID = "27";

export function MessageInput({ onSend }: MessageInputProps) {
  const [value, setValue] = React.useState("");
  const { sendMessage } = useChatContext();
  const { user } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    // Update local UI immediately (optimistic update)
    sendMessage(trimmed);

    // Send over socket with authenticated user identity
    const socket = getSocketClient();
    if (socket && user) {



       socket.emit('admin message sent', {
                    senderId: 2,
                    receiverId: 27,
                    message: trimmed
                });

      // socket.emit("admin message sent", {
      //   senderId: user?.id, 
      //   receiverId: TARGET_USER_ID,
      //   message: trimmed,
      // });
      console.log("message sent to -------------socket", user?.id, TARGET_USER_ID);
    }

    onSend?.(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-end gap-2 rounded-2xl border border-border/70 bg-background/95 px-3 py-2 shadow-[0_-4px_35px_hsl(var(--background)/0.85)]"
      )}
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Message…"
        className="h-9 border-none bg-transparent px-4 text-sm shadow-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        size="lg"
        className="h-9 rounded-full bg-primary px-4 text-xs font-semibold uppercase tracking-[0.16em]"
      >
        Send
      </Button>
    </form>
  );
}
