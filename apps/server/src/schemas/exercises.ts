import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const exercises = pgTable("exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  photoUrl: text("photo_url"),
  videoUrl: text("video_url"),
  authorId: uuid("author_id").references(() => user.id, {
    onDelete: "set null",
  }),
  tags: text("tags").array(),
  public: boolean("public").default(false),
});
