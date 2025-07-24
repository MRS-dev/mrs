import { io, Socket } from "socket.io-client";
import type { Message, Chat, Notification } from "./types";

export type { Chat, Message, Notification };

const socket: Socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
  {
    autoConnect: false,
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

export const joinUserRoom = (userId: string | undefined) => {
  console.log("Joint User Room: ", userId);
  if (userId) socket.emit("joinUserRoom", userId);
};

export const joinRoleRoom = (role: string | undefined) => {
  console.log("Joint Role Room: ", role);
  if (role) socket.emit("joinRoleRoom", role);
};

export const joinChat = (chatId: string | undefined) => {
  console.log("Joint Chat: ", chatId);
  if (chatId) socket.emit("joinChat", chatId);
};

export const onNewMessage = (callback: (message: Message) => void) => {
  socket.on("newMessage", callback);
};

export const onNewNotification = (callback: (notification: any) => void) => {
  socket.on("newNotification", callback);
};

export const offNewMessage = () => {
  socket.off("newMessage");
};

export const offNewNotification = () => {
  socket.off("newNotification");
};

export const sendMessage = (message: {
  chatId: string;
  senderId: string;
  content: string;
}) => {
  socket.emit("sendMessage", message);
};

export default socket;
