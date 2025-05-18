import { sql } from "drizzle-orm";
import { text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  invitedBy: uuid("invited_by").references(() => user.id),
  expiresAt: timestamp("expires_at")
    .notNull()
    .default(sql`NOW() + INTERVAL '30 days'`),
  role: text("role").notNull(),
  acceptedAt: timestamp("accepted_at"),
  invalidatedAt: timestamp("invalidated_at"),
  token: uuid("token").defaultRandom().notNull().unique(),
});
