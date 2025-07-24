import { sendNotification } from "../socket";

export const notificationTypes = {
  NEW_MESSAGE: "new_message",
  NEW_DOCTOR_REQUEST: "new_doctor_request",
  NEW_PATIENT: "new_patient",
  SESSION_REMINDER: "session_reminder",
  APPOINTMENT_CONFIRMED: "appointment_confirmed",
} as const;

export type NotificationType = typeof notificationTypes[keyof typeof notificationTypes];

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  userId?: string;
  role?: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export const createNotification = (
  type: NotificationType,
  title: string,
  content: string,
  data?: any
): NotificationData => ({
  id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  type,
  title,
  content,
  isRead: false,
  createdAt: new Date().toISOString(),
  data,
});

// Fonctions utilitaires pour envoyer des notifications spécifiques

export const notifyNewMessage = (chatId: string, senderName: string, targetUserId: string) => {
  const notification = createNotification(
    notificationTypes.NEW_MESSAGE,
    "Nouveau message",
    `${senderName} vous a envoyé un message`,
    { chatId, actionUrl: `/dashboard/chats`, actionLabel: "Voir le message" }
  );

  sendNotification(notification, { userId: targetUserId });
};

export const notifyNewDoctorRequest = (doctorName: string, requestId: string) => {
  const notification = createNotification(
    notificationTypes.NEW_DOCTOR_REQUEST,
    "Nouvelle demande d'inscription",
    `${doctorName} souhaite s'inscrire en tant que professionnel`,
    { requestId, actionUrl: `/dashboard/registration-requests`, actionLabel: "Examiner la demande" }
  );

  sendNotification(notification, { role: "admin" });
};

export const notifyNewPatient = (patientName: string, patientId: string, doctorId: string) => {
  const notification = createNotification(
    notificationTypes.NEW_PATIENT,
    "Nouveau patient",
    `${patientName} s'est inscrit et vous a été assigné`,
    { patientId, actionUrl: `/dashboard/patients/${patientId}`, actionLabel: "Voir le profil" }
  );

  sendNotification(notification, { userId: doctorId });
};

export const notifySessionReminder = (patientName: string, sessionTime: string, doctorId: string) => {
  const notification = createNotification(
    notificationTypes.SESSION_REMINDER,
    "Rappel de session",
    `Session programmée avec ${patientName} à ${sessionTime}`,
    { actionUrl: `/dashboard/sessions`, actionLabel: "Voir les sessions" }
  );

  sendNotification(notification, { userId: doctorId });
};