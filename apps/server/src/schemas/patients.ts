import { text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { z } from "zod";
import { user } from "./auth";

// Schémas pour les sessions patients
export const sessionFilterSchema = z.object({
  date: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }).optional()
});

export const sessionParamsSchema = z.object({
  sessionId: z.string()
});

export const exerciseReportSchema = z.object({
  exerciseIndex: z.number(),
  status: z.enum(["completed", "not_completed", "not_done"]),
  difficulty: z.number().min(1).max(10).optional(),
  painAreas: z.array(z.object({
    key: z.string(),
    x: z.number(),
    y: z.number(),
    size: z.number(),
    level: z.number().min(1).max(10),
    face: z.enum(["front", "back"])
  })).optional()
});

// Types dérivés
export type SessionFilter = z.infer<typeof sessionFilterSchema>;
export type SessionParams = z.infer<typeof sessionParamsSchema>;
export type ExerciseReport = z.infer<typeof exerciseReportSchema>;

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
  email: text("email").notNull().unique(),
  birthDate: timestamp("birth_date").notNull(),
  phoneNumber: text("phone_number"),
  phoneNumber2: text("phone_number2"),
  socialSecurityNumber: text("social_security_number").notNull(),
  address: jsonb("address").$type<Address>(),
  emergencyContact: jsonb("emergency_contact").$type<EmergencyContact>(),
  allergies: text("allergies"),
  status: text({ enum: ["created", "invited", "active", "inactive"] }),
});
