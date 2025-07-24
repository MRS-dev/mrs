import { db } from "../lib/db";
import { messageReads } from "../schemas/messageReads";
import { messages } from "../schemas/messages";
import { chats } from "../schemas/chats";
import { eq, and, sql, desc, notInArray } from "drizzle-orm";

/**
 * Marque un message comme lu par un utilisateur
 */
export async function markMessageAsRead(userId: string, messageId: string) {
  try {
    await db
      .insert(messageReads)
      .values({
        userId,
        messageId,
        readAt: new Date().toISOString(),
      })
      .onConflictDoNothing();
    
    console.log(`✅ Message ${messageId} marqué comme lu par ${userId}`);
  } catch (error) {
    console.error("❌ Erreur lors du marquage du message comme lu:", error);
  }
}

/**
 * Marque tous les messages d'un chat comme lus par un utilisateur
 */
export async function markChatAsRead(userId: string, chatId: string) {
  try {
    // Récupérer tous les messages du chat que l'utilisateur n'a pas encore lus
    const unreadMessages = await db
      .select({ id: messages.id })
      .from(messages)
      .leftJoin(
        messageReads,
        and(
          eq(messageReads.messageId, messages.id),
          eq(messageReads.userId, userId)
        )
      )
      .where(
        and(
          eq(messages.chatId, chatId),
          sql`${messageReads.messageId} IS NULL` // Messages non lus
        )
      );

    if (unreadMessages.length > 0) {
      const readData = unreadMessages.map((msg) => ({
        userId,
        messageId: msg.id,
        readAt: new Date().toISOString(),
      }));

      await db.insert(messageReads).values(readData);
      console.log(`✅ ${unreadMessages.length} messages marqués comme lus dans le chat ${chatId}`);
    }
  } catch (error) {
    console.error("❌ Erreur lors du marquage du chat comme lu:", error);
  }
}

/**
 * Récupère les chats avec les informations de messages non lus pour un utilisateur
 */
export async function getChatsWithUnreadInfo(userId: string, userRole?: string | null) {
  try {
    // Condition pour les chats visibles selon le rôle
    const whereCondition = userRole === "admin" 
      ? sql`(${chats.participants} @> ARRAY[${userId}]::uuid[] OR ${chats.isSupport} = true)`
      : sql`${chats.participants} @> ARRAY[${userId}]::uuid[]`;

    const chatsWithInfo = await db
      .select({
        id: chats.id,
        title: chats.title,
        participants: chats.participants,
        lastUpdated: chats.lastUpdated,
        isSupport: chats.isSupport,
        supportUserId: chats.supportUserId,
        // Dernier message
        lastMessageId: sql`(
          SELECT m.id 
          FROM messages m 
          WHERE m.chat_id = ${chats.id} 
          ORDER BY m.created_at DESC 
          LIMIT 1
        )`.as("lastMessageId"),
        lastMessageContent: sql`(
          SELECT m.content 
          FROM messages m 
          WHERE m.chat_id = ${chats.id} 
          ORDER BY m.created_at DESC 
          LIMIT 1
        )`.as("lastMessageContent"),
        lastMessageCreatedAt: sql`(
          SELECT m.created_at 
          FROM messages m 
          WHERE m.chat_id = ${chats.id} 
          ORDER BY m.created_at DESC 
          LIMIT 1
        )`.as("lastMessageCreatedAt"),
        lastMessageSenderId: sql`(
          SELECT m.sender_id 
          FROM messages m 
          WHERE m.chat_id = ${chats.id} 
          ORDER BY m.created_at DESC 
          LIMIT 1
        )`.as("lastMessageSenderId"),
        // Nombre de messages non lus
        unreadCount: sql`(
          SELECT COUNT(*)::int
          FROM messages m
          LEFT JOIN message_reads mr ON (m.id = mr.message_id AND mr.user_id = ${userId})
          WHERE m.chat_id = ${chats.id} 
            AND m.sender_id != ${userId}
            AND mr.message_id IS NULL
        )`.as("unreadCount"),
      })
      .from(chats)
      .where(whereCondition)
      .orderBy(desc(chats.lastUpdated));

    return chatsWithInfo;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des chats:", error);
    throw error;
  }
}