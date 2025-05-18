import {
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { invitations } from "./invitations";

export const registrationRequests = pgTable("registration_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  siret: varchar("siret", { length: 14 }).notNull(),
  rpps: varchar("rpps", { length: 11 }).notNull(),
  cni: text("cni").array(),
  healthCard: text("health_card").array(),
  acceptedAt: timestamp("accepted_at"),
  rejectedAt: timestamp("rejected_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  invitationId: uuid("invitation_id").references(() => invitations.id),
});

// Type pour TypeScript
export type RegistrationRequest = typeof registrationRequests.$inferSelect;
export type NewRegistrationRequest = typeof registrationRequests.$inferInsert;
