import { io, Socket } from "socket.io-client";

export type SocketClient = Socket;

let socket: SocketClient | null = null;

type ConnectOptions = {
  userId: string;
  userName: string;
};

export function connectSocketClient(options: ConnectOptions) {
  if (typeof window === "undefined") return null;
  if (socket) return socket;

  const url = "https://chat.mya2zstock.com/";
  socket = io(url, {
    transports: ["websocket", "polling"],
    autoConnect: true,
    withCredentials: true,
    auth: {
      userId: options.userId,
      userName: options.userName,
    },
  });

  // Inform the server who this client is
  socket.on("connect", () => {
    socket?.emit("set user", options.userId);
    console.log("connected to socket");
  });

  // Also emit immediately in case the socket is already connected
  if (socket.connected) {
    socket.emit("set user", options.userId);
    console.log("connected to socket,-");
  }

  return socket;
}

export function getSocketClient(): SocketClient | null {
  return socket;
}

export function disconnectSocketClient() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

