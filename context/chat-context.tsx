"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";
import { getSocketClient } from "@/lib/socket";

export type ChatUser = {
  id: string;
  name: string;
  avatarColor: string;
  isOnline: boolean;
  lastSeen?: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  status: "sent" | "delivered" | "read";
};

export type Conversation = {
  id: string;
  title: string;
  isMuted?: boolean;
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageAt: string;
  participants: ChatUser[];
};

type ChatContextValue = {
  currentUser: ChatUser;
  conversations: Conversation[];
  messages: ChatMessage[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  sendMessage: (content: string) => void;
};

const ChatContext = React.createContext<ChatContextValue | undefined>(undefined);

// Target user ID to chat with
const TARGET_USER_ID = "27";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();

  const me: ChatUser = React.useMemo(
    () => ({
      id: authUser?.id ?? "2",
      name: authUser?.name ?? "Admin",
      avatarColor: "#DAF1DE",
      isOnline: true,
    }),
    [authUser]
  );

  // Create a single conversation with user 27
  const conversationId = `conv-${TARGET_USER_ID}`;
  console.log("conversationId", conversationId);
  const [activeConversationId, setActiveConversationId] = React.useState(conversationId);
  
  const [conversations, setConversations] = React.useState<Conversation[]>([
    {
      id: conversationId,
      title: `User ${TARGET_USER_ID}`,
      unreadCount: 0,
      lastMessagePreview: "No messages yet",
      lastMessageAt: new Date().toISOString(),
      participants: [
        {
          id: TARGET_USER_ID,
          name: `User ${TARGET_USER_ID}`,
          avatarColor: "#BEB69B",
          isOnline: true,
        },
      ],
    },
  ]);

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  const sendMessage = React.useCallback(
    (content: string) => {
      if (!activeConversationId) return;

      const createdAt = new Date().toISOString();
      const newMessage: ChatMessage = {
        id: `local-${Date.now()}`,
        conversationId: activeConversationId,
        senderId: me.id,
        content,
        createdAt,
        status: "sent",
      };

      setMessages((prev) => [...prev, newMessage]);

      // Keep sidebar metadata in sync
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                lastMessagePreview: content,
                lastMessageAt: createdAt,
                unreadCount: conv.unreadCount,
              }
            : conv
        )
      );
    },
    [activeConversationId, me.id]
  );

  const value = React.useMemo<ChatContextValue>(
    () => ({
      currentUser: me,
      conversations,
      messages,
      activeConversationId,
      setActiveConversationId,
      sendMessage,
    }),
    [activeConversationId, conversations, messages, me, sendMessage]
  );

  // Socket.io listeners for real-time messages
  React.useEffect(() => {
    const socket = getSocketClient();
    if (!socket) return;

    type AdminPayload = {
      senderId: string;
      message: string;
      senderName?: string;
    };

    type AdminSentPayload = {
      senderId: string;
      receiverId: string;
      message: string;
      senderName?: string;
    };

    const appendMessage = (
      payload: { senderId: string; message: string },
      idPrefix: string
    ) => {
      // Only show messages from user 27 (the target user we're chatting with)
      if (payload.senderId !== TARGET_USER_ID && payload.senderId !== me.id) {
        return;
      }

      const createdAt = new Date().toISOString();
      const incoming: ChatMessage = {
        id: `${idPrefix}-${Date.now()}`,
        conversationId: activeConversationId,
        senderId: payload.senderId,
        content: payload.message,
        createdAt,
        status: "delivered",
      };

      setMessages((prev) => [...prev, incoming]);

      // Update conversation metadata
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                lastMessagePreview: payload.message,
                lastMessageAt: createdAt,
                unreadCount:
                  payload.senderId === TARGET_USER_ID
                    ? conv.unreadCount + 1
                    : conv.unreadCount,
              }
            : conv
        )
      );
    };

    const handleAdminMessageReceive = (payload: AdminPayload) => {
      // Only show messages from user 27
      if (payload.senderId === TARGET_USER_ID) {
        appendMessage(payload, "remote");
      }
    };

    const handleAdminMessageSent = (payload: AdminSentPayload) => {
      // Only append if this client is the intended receiver (admin) and sender is user 27
      // OR if we sent it and it's being echoed back
      if (
        (payload.receiverId === me.id && payload.senderId === TARGET_USER_ID) ||
        (payload.senderId === me.id && payload.receiverId === TARGET_USER_ID)
      ) {
        appendMessage(payload, "admin");
      }
    };

    socket.on("admin message receive", handleAdminMessageReceive);
    socket.on("admin message sent", handleAdminMessageSent);

    return () => {
      socket.off("admin message receive", handleAdminMessageReceive);
      socket.off("admin message sent", handleAdminMessageSent);
    };
  }, [activeConversationId, me.id]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const ctx = React.useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return ctx;
}
