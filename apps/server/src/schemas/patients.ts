import { text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { z } from "zod";
import { user } from "./auth";

const AddressSchema = z.object({
  street: z.string(),
  complement: z.string().optional(),
  city: z.string(),
  postalCode: z.string(),
  country: z.string(),
});
type Address = z.infer<typeof AddressSchema>;

const EmergencyContactSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{10,15}$/)
    .optional(),
  phoneNumber2: z
    .string()
    .regex(/^\+?\d{10,15}$/)
    .optional(),
  email: z.string().email().optional(),
});
type EmergencyContact = z.infer<typeof EmergencyContactSchema>;
export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  birthDate: timestamp("birth_date").notNull(),
  phoneNumber: text("phone_number"),
  socialSecurityNumber: text("social_security_number").notNull(),
  address: jsonb("address").$type<Address>(),
  emergencyContact: jsonb("emergency_contact").$type<EmergencyContact>(),
  allergies: text("allergies"),
  status: text({ enum: ["created", "invited", "active", "inactive"] }),
});
