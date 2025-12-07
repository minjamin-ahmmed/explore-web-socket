import { io, Socket } from "socket.io-client";

export type SocketClient = Socket;

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

let socket: SocketClient | null = null;
let connectionStatus: ConnectionStatus = "disconnected";
let statusListeners: Set<(status: ConnectionStatus) => void> = new Set();

function notifyStatusListeners(status: ConnectionStatus) {
  connectionStatus = status;
  statusListeners.forEach((listener) => listener(status));
}

type ConnectOptions = {
  userId: string;
  userName: string;
};

export function connectSocketClient(options: ConnectOptions) {
  if (typeof window === "undefined") return null;
  if (socket) return socket;

  const url = "https://chat.mya2zstock.com/";
  
  console.log("Initializing WebSocket connection to:", url);
  notifyStatusListeners("connecting");

  socket = io(url, {
    transports: ["websocket", "polling"],
    autoConnect: true,
    withCredentials: true,
    auth: {
      userId: options.userId,
      userName: options.userName,
    },
  });

  // Connection successful
  socket.on("connect", () => {
    console.log("WebSocket CONNECTED! Socket ID:", socket?.id);
    console.log("Setting user ID:", options.userId);
    socket?.emit("set user", options.userId);
    notifyStatusListeners("connected");
  });

  // Connection failed
  socket.on("connect_error", (error) => {
    console.error("WebSocket CONNECTION ERROR:", error.message);
    notifyStatusListeners("error");
  });

  // Disconnected
  socket.on("disconnect", (reason) => {
    console.warn("WebSocket DISCONNECTED. Reason:", reason);
    notifyStatusListeners("disconnected");
    
    // Auto-reconnect on certain disconnect reasons
    if (reason === "io server disconnect") {
      // Server disconnected, reconnect manually
      socket?.connect();
    }
  });

  // Reconnection attempt
  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log("Reconnection attempt #", attemptNumber);
    notifyStatusListeners("connecting");
  });

  // Reconnection successful
  socket.on("reconnect", (attemptNumber) => {
    console.log("WebSocket RECONNECTED after", attemptNumber, "attempts");
    socket?.emit("set user", options.userId);
    notifyStatusListeners("connected");
  });

  // Reconnection failed
  socket.on("reconnect_failed", () => {
    console.error("WebSocket RECONNECTION FAILED");
    notifyStatusListeners("error");
  });

  // Also emit immediately in case the socket is already connected
  if (socket.connected) {
    socket.emit("set user", options.userId);
    console.log("Socket already connected, user ID set:", options.userId);
    notifyStatusListeners("connected");
  }

  return socket;
}

export function getSocketClient(): SocketClient | null {
  return socket;
}

export function getConnectionStatus(): ConnectionStatus {
  return connectionStatus;
}

export function subscribeToConnectionStatus(
  callback: (status: ConnectionStatus) => void
): () => void {
  statusListeners.add(callback);
  // Immediately call with current status
  callback(connectionStatus);
  // Return unsubscribe function
  return () => {
    statusListeners.delete(callback);
  };
}

export function disconnectSocketClient() {
  if (socket) {
    console.log("Disconnecting WebSocket...");
    socket.disconnect();
    socket = null;
    notifyStatusListeners("disconnected");
  }
}
