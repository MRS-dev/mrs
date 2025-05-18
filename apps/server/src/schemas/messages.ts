import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { chats } from "./chats";
// Schéma pour la table des messages
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id),
  senderId: uuid("sender_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
