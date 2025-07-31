import { db } from "../lib/db";
import { chats } from "../schemas/chats";
import { patients } from "../schemas/patients";
import { pros } from "../schemas/pros";
import { eq, sql } from "drizzle-orm";

/**
 * Crée automatiquement un chat entre un pro et un patient
 * @param proId - ID du professionnel 
 * @param patientId - ID du patient
 * @returns Le chat créé ou existant
 */
export async function createProPatientChat(proId: string, patientId: string) {
  try {
    // Récupérer les informations du patient pour obtenir son userId
    const [patient] = await db
      .select({ userId: patients.userId, firstName: patients.firstName, lastName: patients.lastName })
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!patient?.userId) {
      throw new Error("Patient userId not found - patient may not be registered yet");
    }

    // Récupérer les informations du pro
    const [pro] = await db
      .select({ firstName: pros.firstName, lastName: pros.lastName })
      .from(pros)
      .where(eq(pros.id, proId));

    if (!pro) {
      throw new Error("Pro not found");
    }

    const participants = [proId, patient.userId];

    // Vérifier si un chat existe déjà entre ce pro et ce patient
    const existingChat = await db
      .select()
      .from(chats)
      .where(
        sql`${chats.participants} @> ARRAY[${proId}, ${patient.userId}]::uuid[] AND 
          array_length(${chats.participants}, 1) = 2`
      );

    if (existingChat.length > 0) {
      console.log("Chat already exists between pro and patient");
      return existingChat[0];
    }

    // Créer un nouveau chat
    const chatTitle = `Dr ${pro.firstName} ${pro.lastName} - ${patient.firstName} ${patient.lastName}`;
    
    const [newChat] = await db
      .insert(chats)
      .values({
        title: chatTitle,
        participants: participants,
        lastUpdated: new Date(),
        isSupport: false,
      })
      .returning();

    console.log("New chat created:", newChat.id);
    return newChat;

  } catch (error) {
    console.error("Error creating pro-patient chat:", error);
    throw error;
  }
}

/**
 * Supprime tous les chats d'un patient avec ses anciens docteurs
 * @param patientId - ID du patient
 * @param excludeProId - ID du pro à exclure (nouveau docteur)
 */
export async function deleteOldPatientChats(patientId: string, excludeProId: string) {
  try {
    // Récupérer le userId du patient
    const [patient] = await db
      .select({ userId: patients.userId })
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!patient?.userId) {
      console.log("Patient userId not found, skipping chat deletion");
      return;
    }

    // Trouver tous les chats du patient et les supprimer sauf celui avec le nouveau pro
    const patientChats = await db
      .select()
      .from(chats)
      .where(sql`${chats.participants} @> ARRAY[${patient.userId}]::uuid[]`);

    for (const chat of patientChats) {
      // Si le chat contient le nouveau pro, on le garde
      if (chat.participants.includes(excludeProId)) {
        continue;
      }

      // Sinon on supprime le chat
      await db.delete(chats).where(eq(chats.id, chat.id));
      console.log("Deleted old chat:", chat.id);
    }

  } catch (error) {
    console.error("Error deleting old patient chats:", error);
    throw error;
  }
}