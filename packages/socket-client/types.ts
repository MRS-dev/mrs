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
};
