import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { patients } from "./patients";
import { pros } from "./pros";
import { exercises } from "./exercises";
// 1. ENUMS PostgreSQL
export const sessionStatus = pgEnum("session_status", [
  "created",
  "started",
  "paused",
  "completed",
  "cancelled",
]);
export const reportStatus = pgEnum("exercise_report_status", [
  "completed",
  "not_completed",
  "not_done",
]);
export const faceSide = pgEnum("face_side", ["front", "back"]);

// 2. Templates de programmes réutilisables
export const workoutPrograms = pgTable("workout_programs", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => user.id),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workoutProgramExercises = pgTable("workout_program_exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  programId: uuid("program_id")
    .notNull()
    .references(() => workoutPrograms.id),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id),
  executionTime: integer("execution_time"),
  repetitions: integer("repetitions"),
  sets: integer("sets"),
  restTime: integer("rest_time"),
});

// 3. Séances planifiées
export const therapySessions = pgTable("therapy_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id),
  proId: uuid("doctor_id")
    .notNull()
    .references(() => pros.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: sessionStatus("status").default("created").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const therapySessionExercises = pgTable("therapy_session_exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => therapySessions.id),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id),
  executionTime: integer("execution_time"),
  repetitions: integer("repetitions"),
  sets: integer("sets"),
  restTime: integer("rest_time"),
});

// 4. Rapports de séances
export const sessionReports = pgTable("session_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => therapySessions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const exerciseReports = pgTable("exercise_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => sessionReports.id),
  sessionExerciseId: uuid("session_exercise_id")
    .notNull()
    .references(() => therapySessionExercises.id),
  status: reportStatus("status").default("not_done").notNull(),
  difficulty: integer("difficulty"),
});

export const painMarkings = pgTable("pain_markings", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportExerciseId: uuid("exercise_report_id")
    .notNull()
    .references(() => exerciseReports.id),
  key: text("key").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  size: integer("size").notNull(),
  level: integer("level").notNull(),
  face: faceSide("face").notNull(),
});
