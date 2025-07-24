export type Message = {
  id: string; // Identifiant unique du message
  chatId: string; // Référence à la conversation à laquelle appartient le message
  senderId: string; // ID de l'expéditeur du message
  content: string; // Contenu du message
  createdAt: string; // Date de création
  lastUpdated?: string; // Date de mise à jour (facultatif)
};

export type Chat = {
  id: string; // Identifiant unique de la conversation
  participants: string[]; // Liste des IDs des participants (doctor, patient, admin)
  messages: Message[]; // Liste des messages associés à la conversation
  createdAt: string; // Date de création
  lastUpdated?: string; // Date de mise à jour (facultatif)
  title?: string; // Titre de la conversation (facultatif, utile pour l'admin ou le doctor)
  isSupport?: boolean; // Indique si c'est un chat de support
  supportUserId?: string; // ID du professionnel pour les chats de support
  lastMessage?: string; // Dernier message du chat (deprecated)
  // Nouvelles propriétés pour les messages non lus
  lastMessageId?: string; // ID du dernier message
  lastMessageContent?: string; // Contenu du dernier message
  lastMessageCreatedAt?: string; // Date de création du dernier message
  lastMessageSenderId?: string; // ID de l'expéditeur du dernier message
  unreadCount: number; // Nombre de messages non lus
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  content: string;
  userId?: string;
  role?: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
};
