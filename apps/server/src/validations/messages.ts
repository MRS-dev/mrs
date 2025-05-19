import { createInsertSchema } from "drizzle-zod";
import { messages } from "../schemas/messages";

const messagesInsertSchema = createInsertSchema(messages);
export const createMessageSchema = messagesInsertSchema.pick({
  content: true,
  chatId: true,
});
