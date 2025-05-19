import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { roles } from "../lib/roles";
import { db } from "../lib/db";
import { eq, desc, sql } from "drizzle-orm";
import { chats } from "../schemas/chats";
import { messages } from "../schemas/messages";
import { zValidator } from "@hono/zod-validator";
import { createChatSchema } from "../validations/chats";

const chatsRoutes = new Hono<HonoType>()
  .basePath("/chats")
  .use("*", roles("authenticated"))
  .get("/", async (c) => {
    const user = c.get("user");
    const userId = user?.id;

    const responses = await db
      .select({
        id: chats.id,
        title: chats.title,
        participants: chats.participants,
        lastUpdated: chats.lastUpdated,
        lastMessage: messages.content,
      })
      .from(chats)
      .leftJoin(messages, eq(chats.id, messages.chatId))
      .where(sql`${chats.participants} @> ${[userId]}`)
      .groupBy(chats.id)
      .orderBy(desc(chats.lastUpdated));

    return c.json(responses);
  })
  .post(
    "/",
    roles("authenticated"),
    zValidator("json", createChatSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const userId = user?.id;
        const { title, participants } = await c.req.json();

        // Vérification si un chat avec les mêmes participants existe déjà
        const existingChat = await db
          .select()
          .from(chats)
          .where(
            sql`${chats.participants} @> ${[...participants, userId]} AND 
              array_length(${chats.participants}, 1) = ${participants.length + 1}`
          );

        if (existingChat.length > 0) {
          return c.json(
            { message: "Un chat avec ces participants existe déjà." },
            400
          );
        }

        const date = new Date();
        // Création du nouveau chat
        const newChat = await db
          .insert(chats)
          .values({
            title: title || null,
            participants: [...participants, userId],
            lastUpdated: date,
          })
          .returning();

        return c.json(newChat[0], 201);
      } catch (error) {
        console.error("Error creating chat:", error);
        return c.json({ message: "Error creating chat" }, 500);
      }
    }
  );

export default chatsRoutes;
