import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { messages } from "./messages";

// Table pour suivre quels messages ont été lus par quels utilisateurs
export const messageReads = pgTable(
  "message_reads",
  {
    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    messageId: uuid("message_id")
      .references(() => messages.id, { onDelete: "cascade" })
      .notNull(),
    readAt: timestamp("read_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.messageId] }),
    };
  }
);