import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { patients } from "./patients";
import { pros } from "./pros";

export const patientProRelations = pgTable("patient_pro_relations", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id, {
    onDelete: "cascade",
  }),
  proId: uuid("pro_id").references(() => pros.id, {
    onDelete: "cascade",
  }),
});
