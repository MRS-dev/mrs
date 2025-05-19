import { createInsertSchema } from "drizzle-zod";
import { chats } from "../schemas/chats";
import { z } from "zod";

const chatInsertSchema = createInsertSchema(chats);
export const createChatSchema = chatInsertSchema
  .pick({
    title: true,
    participants: true,
  })
  .extend({
    participants: z.array(z.string()),
  });
export const updateChatSchema = chatInsertSchema
  .pick({
    title: true,
    participants: true,
  })
  .extend({
    participants: z.array(z.string()),
  });
