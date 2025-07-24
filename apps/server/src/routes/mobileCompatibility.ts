import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { roles } from "../lib/roles";
import { db } from "../lib/db";
import { eq, desc } from "drizzle-orm";
import { chats } from "../schemas/chats";
import { messages } from "../schemas/messages";
import { zValidator } from "@hono/zod-validator";
import { createChatSchema } from "../validations/chats";
import { createMessageSchema } from "../validations/messages";
import { getChatsWithUnreadInfo } from "../utils/messageReads";
import { z } from "zod";
import { auth } from "../lib/auth";

// Routes de compatibilité pour l'ancienne API mobile mrs_patient
const mobileCompatibilityRoutes = new Hono<HonoType>()
  .use("*", roles("authenticated"))
  
  // GET /chats/chat/{chatId}/messages (ancienne route mobile)
  .get(
    "/chats/chat/:chatId/messages",
    zValidator("param", z.object({ chatId: z.string() })),
    async (c) => {
      try {
        const user = c.get("user");
        const { chatId } = c.req.valid("param");

        const chatMessages = await db
          .select()
          .from(messages)
          .where(eq(messages.chatId, chatId))
          .orderBy(desc(messages.createdAt));

        return c.json(chatMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        return c.json({ message: "Error fetching messages" }, 500);
      }
    }
  )
  
  // POST /chats/chat/{chatId}/messages/new (ancienne route mobile)
  .post(
    "/chats/chat/:chatId/messages/new",
    zValidator("param", z.object({ chatId: z.string() })),
    zValidator("json", z.object({ 
      content: z.string(),
      senderId: z.string().optional() // L'app mobile envoie senderId mais on utilise l'user du token
    })),
    async (c) => {
      try {
        const user = c.get("user");
        const { chatId } = c.req.valid("param");
        const { content } = c.req.valid("json");

        const newMessage = await db
          .insert(messages)
          .values({
            chatId,
            senderId: user?.id!,
            content,
          })
          .returning();

        // Mettre à jour le timestamp du chat
        await db
          .update(chats)
          .set({ lastUpdated: new Date() })
          .where(eq(chats.id, chatId));

        return c.json(newMessage[0], 201);
      } catch (error) {
        console.error("Error creating message:", error);
        return c.json({ message: "Error creating message" }, 500);
      }
    }
  )
  
  // Note: Chat creation route temporarily removed due to TypeScript compilation issue
  // The mobile app should use the main /api/chats endpoint instead

export default mobileCompatibilityRoutes;