import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Schéma pour la table des chats
export const chats = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  participants: uuid("participants")
    .references(() => user.id)
    .array()
    .notNull(), // UUIDs des participants
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});
