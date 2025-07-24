// Script de test pour les fonctionnalités Socket.IO
const { io } = require("socket.io-client");

console.log("🧪 Test du système Socket.IO...");

// Configuration de test
const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:4000";
const TEST_USER_ID = "test-user-123";
const TEST_CHAT_ID = "test-chat-456";

// Créer une connexion de test
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

// Gestion des événements de connexion
socket.on("connect", () => {
  console.log("✅ Connecté au serveur Socket.IO avec l'ID:", socket.id);
  
  // Rejoindre les rooms de test
  socket.emit("joinUserRoom", TEST_USER_ID);
  socket.emit("joinChat", TEST_CHAT_ID);
  
  console.log("📡 Rooms rejointes - User:", TEST_USER_ID, "Chat:", TEST_CHAT_ID);
  
  // Test d'envoi de message
  setTimeout(() => {
    console.log("📤 Envoi d'un message de test...");
    socket.emit("sendMessage", {
      id: Date.now().toString(),
      chatId: TEST_CHAT_ID,
      senderId: TEST_USER_ID,
      content: "Message de test depuis le script",
      createdAt: new Date().toISOString(),
    });
  }, 1000);
});

socket.on("connect_error", (error) => {
  console.error("❌ Erreur de connexion:", error.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Déconnecté:", reason);
});

// Écouter les nouveaux messages
socket.on("newMessage", (messages) => {
  console.log("📨 Nouveau message reçu:", messages);
});

// Écouter les notifications
socket.on("newNotification", (notification) => {
  console.log("🔔 Nouvelle notification reçue:", notification);
});

// Démarrer la connexion
console.log("🔌 Tentative de connexion à:", SOCKET_URL);
socket.connect();

// Arrêter le test après 10 secondes
setTimeout(() => {
  console.log("🏁 Fin du test - Déconnexion...");
  socket.disconnect();
  process.exit(0);
}, 10000);