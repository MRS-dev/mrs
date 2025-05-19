import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import {
  workoutSessions,
  WorkoutSessionReportSchema,
} from "../schemas/workoutSessions";
import {
  workoutTemplates,
  WorkProgramSchema,
} from "../schemas/workoutTemplates";

const workoutSessionInsertSchema = createInsertSchema(workoutSessions);
export const createWorkoutSessionSchema = workoutSessionInsertSchema
  .pick({
    program: true,
    patientId: true,
    date: true,
  })
  .extend({
    program: WorkProgramSchema,
  });

export const createWorkoutSessionWithDatesSchema = createWorkoutSessionSchema
  .extend({
    dates: z.array(z.coerce.date()),
  })
  .omit({
    date: true,
  });
export const updateWorkoutSessionSchema = workoutSessionInsertSchema
  .pick({
    program: true,
    date: true,
    patientId: true,
  })
  .extend({
    program: WorkProgramSchema,
    date: z.coerce.date(),
  });
