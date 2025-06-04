import { io, Socket } from "socket.io-client";
import type { Message, Chat } from "./types";

export type { Chat, Message };

const socket: Socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
  {
    autoConnect: true,
    withCredentials: true,
  }
);
console.log("📡 Initialisation du client Socket.IO...");

socket.on("connect", () => {
  console.log(`✅ Connecté au WebSocket avec ID : ${socket.id}`);
});

socket.on("connect_error", (err) => {
  console.error("❌ Erreur de connexion WebSocket :", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Déconnecté du WebSocket :", reason);
});

export const joinChat = (chatId: string | undefined) => {
  console.log("Joint Chat: ", chatId);
  if (chatId) socket.emit("joinChat", chatId);
};

export const onNewMessage = (callback: (message: Message) => void) => {
  socket.on("newMessage", callback);
};

export const sendMessage = (message: {
  chatId: string;
  senderId: string;
  content: string;
}) => {
  socket.emit("sendMessage", message);
};

export default socket;
