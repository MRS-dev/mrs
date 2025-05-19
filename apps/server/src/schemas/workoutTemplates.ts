import { boolean, jsonb, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { z } from "zod";

export const WorkProgramSchema = z.object({
  exercises: z
    .array(
      z.object({
        exerciseId: z.string(),
        executionTime: z.number(),
        repetitions: z.number(),
        series: z.number(),
        restTime: z.number(),
      })
    )
    .min(1, { message: "At least one exercise is required" }),
});

type WorkProgram = z.infer<typeof WorkProgramSchema>;
export const workoutTemplates = pgTable("workout_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => user.id),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  program: jsonb("program").$type<WorkProgram>(),
  public: boolean("public").default(false).notNull(),
});
