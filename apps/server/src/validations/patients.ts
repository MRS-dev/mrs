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
  })
  .extend({
    birthDate: z.coerce.date(),
  });
