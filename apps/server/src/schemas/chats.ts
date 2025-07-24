import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
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
  isSupport: boolean("is_support").default(false).notNull(), // Indique si c'est un chat de support
  supportUserId: uuid("support_user_id").references(() => user.id), // ID du professionnel pour les chats de support
});
