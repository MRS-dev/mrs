import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const exercices = pgTable("exercices", {
  id: uuid("id")
    .primaryKey()
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorId: uuid("author_id").references(() => user.id),
});
