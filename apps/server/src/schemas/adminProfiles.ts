import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const adminProfiles = pgTable("admin_profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
});
