import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { roles } from "../lib/roles";
import { db } from "../lib/db";
import { eq, desc, and } from "drizzle-orm";
import { messages } from "../schemas/messages";
import { chats } from "../schemas/chats";
import { zValidator } from "@hono/zod-validator";
import { createMessageSchema } from "../validations/messages";
import { io } from "../socket";

const messagesRoutes = new Hono<HonoType>()
  .basePath("/messages")
  .use("*", roles("authenticated"))
  .get("/:chatId", async (c) => {
    const user = c.get("user");
    const userId = user?.id || "";
    const { chatId } = c.req.param();

    // Récupérer TOUS les messages du chat, pas seulement ceux de l'utilisateur connecté
    const responses = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    return c.json(responses);
  })
  .post(
    "/",
    roles("authenticated"),
    zValidator("json", createMessageSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const userId = user?.id || "";
        if (!userId) {
          return c.json({ message: "User not found" }, 404);
        }
        const { content, chatId } = await c.req.json();

        // Insérer le nouveau message
        const [newMessage] = await db
          .insert(messages)
          .values({ content, chatId, senderId: userId || "" })
          .returning();

        // Mettre à jour lastUpdated du chat
        await db
          .update(chats)
          .set({ lastUpdated: new Date() })
          .where(eq(chats.id, chatId));

        console.log("🔊 Emitting newMessage to chatId:", chatId, newMessage);
        io.to(chatId).emit("newMessage", newMessage);

        // Envoyer une notification aux autres participants du chat
        // TODO: Récupérer les participants du chat et envoyer des notifications
        // sendNotification({
        //   id: Date.now().toString(),
        //   type: "new_message",
        //   title: "Nouveau message",
        //   content: `Nouveau message dans ${chatId}`,
        //   isRead: false,
        //   createdAt: new Date().toISOString(),
        //   data: { chatId }
        // }, { userId: "otherParticipantId" });

        return c.json(newMessage, 201);
      } catch (error) {
        console.error("Error creating message:", error);
        return c.json({ message: "Error creating message" }, 500);
      }
    }
  );

export default messagesRoutes;
