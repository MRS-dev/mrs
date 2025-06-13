import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { ads } from "./ads";

/**
 * Table des événements publicitaires (views, clicks, etc.)
 */
export const adEvents = pgTable("ad_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  adId: uuid("ad_id")
    .notNull()
    .references(() => ads.id),
  type: text("type").notNull(), // ex: 'view', 'click'
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
});
