import { Server as SocketIOServer } from "socket.io";

// 🔒 Origines autorisées
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

// 📡 Instance Socket.IO sans serveur HTTP direct (on utilise .listen(port) dans index.ts)
export const io = new SocketIOServer({
  cors: {
    origin: (origin, callback) => {
      const isDev = process.env.NODE_ENV === "development";

      if (isDev && origin?.startsWith("http://localhost")) {
        return callback(null, true);
      }

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`❌ CORS refusé pour l'origine : ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔧 Configuration des handlers
export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connecté : ${socket.id}`);

    socket.join("global");
    console.log(`📥 Ajout à la room globale`);

    socket.on("joinRoleRoom", (role: string) => {
      const roomName = `role:${role}`;
      socket.join(roomName);
      console.log(`👤 Ajouté à la room rôle : ${roomName}`);
    });

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`💬 Rejoint le chat : ${chatId}`);
    });

    socket.on("disconnect", () => {
      console.log(`👋 Déconnecté : ${socket.id}`);
    });
  });
};

// 📤 Fonction utilitaire pour envoyer une notification
export const sendNotification = (
  data: any,
  options: { userId?: string; role?: string } = {}
) => {
  const { userId, role } = options;

  if (userId) {
    const sent = io.to(userId).emit("newNotification", data);
    console.log(`📨 Notification envoyée à l'utilisateur : ${userId}`, data);
    return sent;
  }

  if (role) {
    const room = `role:${role}`;
    const sent = io.to(room).emit("newNotification", data);
    console.log(`📨 Notification envoyée à la room : ${room}`, data);
    return sent;
  }

  io.emit("newNotification", data);
  console.log("📨 Notification envoyée globalement", data);
};
