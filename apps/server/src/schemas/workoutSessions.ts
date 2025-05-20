import { jsonb, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { z } from "zod";
import { patients } from "./patients";
import type { WorkProgramSchema } from "./workoutTemplates";

export const WorkoutSessionReportSchema = z.object({
  exercises: z.array(
    z.object({
      exerciseIndex: z.number(),
      status: z.enum(["completed", "not_completed", "not_done"]),
      difficulty: z.number().optional(),
      painAreas: z.array(
        z.object({
          key: z.string(),
          x: z.number(),
          y: z.number(),
          size: z.number(),
          level: z.number(),
          face: z.enum(["front", "back"]),
        })
      ),
    })
  ),
});
type WorkoutSessionReport = z.infer<typeof WorkoutSessionReportSchema>;
type WorkProgram = z.infer<typeof WorkProgramSchema>;
export const workoutSessions = pgTable("workout_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id, {
      onDelete: "cascade",
    }),
  proId: uuid("pro_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "set null",
    }),
  date: timestamp("date").notNull(),
  status: text("status", {
    enum: ["created", "started", "paused", "completed", "cancelled"],
  }),
  report: jsonb("report").$type<WorkoutSessionReport>(),
  program: jsonb("program").$type<WorkProgram>(),
});
