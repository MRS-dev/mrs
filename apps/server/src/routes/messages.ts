import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { roles } from "../lib/roles";
import { db } from "../lib/db";
import { eq, desc, and } from "drizzle-orm";
import { messages } from "../schemas/messages";
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
    const responses = await db
      .select()
      .from(messages)
      .where(and(eq(messages.chatId, chatId), eq(messages.senderId, userId)))
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
        const newMessage = await db
          .insert(messages)
          .values({ content, chatId, senderId: userId || "" })
          .returning();

        console.log("🔊 Emitting newMessage to chatId:", chatId, newMessage);
        io.to(chatId).emit("newMessage", newMessage);
        return c.json(newMessage[0], 201);
      } catch (error) {
        console.error("Error creating message:", error);
        return c.json({ message: "Error creating message" }, 500);
      }
    }
  );

export default messagesRoutes;
