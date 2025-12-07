"use client";

import * as React from "react";
import { useChatContext } from "@/context/chat-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "@/components/chat/message-bubble";
import { AnimatePresence, motion } from "framer-motion";

export function MessageList() {
  const { messages, activeConversationId, currentUser } = useChatContext();
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  const visibleMessages = React.useMemo(
    () => {
      const filtered = messages
        .filter((m) => m.conversationId === activeConversationId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      console.log("📋 MessageList - Total messages:", messages.length, "Visible:", filtered.length);
      return filtered;
    },
    [messages, activeConversationId]
  );

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [visibleMessages.length, activeConversationId]);

  return (
    <ScrollArea className="flex-1 px-3 pb-4 pt-3">
      <motion.div
        ref={viewportRef}
        className="flex flex-col gap-2.5"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <AnimatePresence initial={false}>
          {visibleMessages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <MessageBubble
                message={message}
                isOwn={message.senderId === currentUser.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </ScrollArea>
  );
}


