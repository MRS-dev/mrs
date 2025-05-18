import { text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export interface IAddress {
  street: string;
  complement?: string;
  city: string;
  postalCode: string;
  country: string;
}

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  birthDate: timestamp("birth_date").notNull(),
  phoneNumber: text("phone_number"),
  socialSecurityNumber: text("social_security_number").notNull(),
  address: jsonb("address").$type<IAddress>(),
  emergencyContact: jsonb("emergency_contact").$type<IAddress>(),
  allergies: text("allergies"),
  status: text({ enum: ["created", "invited", "active", "inactive"] }),
});
