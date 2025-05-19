import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import {
  workoutTemplates,
  WorkProgramSchema,
} from "../schemas/workoutTemplates";

const workoutTemplateInsertSchema = createInsertSchema(workoutTemplates);
export const createWorkoutTemplateSchema = workoutTemplateInsertSchema
  .pick({
    name: true,
    program: true,
  })
  .extend({
    program: WorkProgramSchema,
  });

export const updateWorkoutTemplateSchema = workoutTemplateInsertSchema
  .pick({
    name: true,
    program: true,
  })
  .extend({
    program: WorkProgramSchema,
  });
