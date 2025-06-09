import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const ads = pgTable("ads", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  photoUrl: text("photo_url").notNull(),
  url: text("url").notNull(),
  enable: boolean("enable").notNull().default(true),
  authorId: uuid("author_id")
    .notNull()
    .references(() => user.id),
  clicks: integer("clicks").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
});
