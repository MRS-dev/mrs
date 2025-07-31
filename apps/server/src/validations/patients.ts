import { createInsertSchema } from "drizzle-zod";
import { patients } from "../schemas/patients";
import { z } from "zod";

const patientInsertSchema = createInsertSchema(patients);
export const createPatientSchema = patientInsertSchema
  .pick({
    firstName: true,
    address: true,
    allergies: true,
    socialSecurityNumber: true,
    emergencyContact: true,
    email: true,
    phoneNumber: true,
    phoneNumber2: true,
    lastName: true,
    birthDate: true,
  })
  .extend({
    birthDate: z.coerce.date(),
  });
export const updatePatientSchema = patientInsertSchema
  .pick({
    firstName: true,
    lastName: true,
    address: true,
    allergies: true,
    socialSecurityNumber: true,
    birthDate: true,
    emergencyContact: true,
    email: true,
    phoneNumber: true,
    phoneNumber2: true,
  })
  .extend({
    birthDate: z.coerce.date(),
  })
  .partial(); // Rend tous les champs optionnels

// Schéma spécifique pour la mise à jour des infos personnelles du patient
export const updatePatientPersonalInfoSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  birthDate: z.string().optional(), // Accepte string ISO qui sera convertie en Date
  phoneNumber: z.string().optional(),
  address: z.any().optional(), // JSON flexible
  weight: z.any().optional(),
  height: z.any().optional(),
  allergies: z.string().optional(),
});
