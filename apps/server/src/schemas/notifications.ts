import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  role: text("role"), // Pour les notifications basées sur les rôles (admin, pro, user)
  type: text("type").notNull(), // Type de notification (new_doctor_request, admin_alert, etc.)
  title: text("title").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// Table pour suivre quelles notifications ont été lues par quels utilisateurs
// (pour les notifications globales ou basées sur les rôles)
export const notificationReads = pgTable("notification_reads", {
  id: uuid("id").defaultRandom().primaryKey(),
  notificationId: uuid("notification_id")
    .references(() => notifications.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  readAt: timestamp("read_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});