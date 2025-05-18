import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { roles } from "../lib/roles";
import { db } from "../lib/db";
import { eq, sql, and } from "drizzle-orm";
import { patients } from "../schemas/patients";
import { patientProRelations } from "../schemas/patientProRelations";
import {
  getQueryPagination,
  paginationSchema,
  toPaginatedResponse,
} from "../lib/utils/paginations";
import { zValidator } from "@hono/zod-validator";

const patientsRoutes = new Hono<HonoType>()
  .basePath("/patients")
  .use("*", roles("pro"))
  .get("/", zValidator("query", paginationSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Get the total count of patients
    const totalPatients = await db
      .select({ count: sql`COUNT(*)` })
      .from(patientProRelations)
      .where(eq(patientProRelations.proId, userId))
      .then((result) => result[0]?.count || 0);

    // Get the paginated list of patients
    const patientList = await db
      .select({
        id: patients.id,
        firstName: patients.firstName,
        lastName: patients.lastName,
        birthDate: patients.birthDate,
      })
      .from(patients)
      .leftJoin(
        patientProRelations,
        eq(patientProRelations.patientId, patients.id)
      )
      .where(eq(patientProRelations.proId, userId))
      .limit(limit)
      .offset(offset);

    return c.json(
      toPaginatedResponse({
        items: patientList,
        totalCount: Number(totalPatients),
        page,
        limit,
      })
    );
  })
  .get("/:patientId", async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { patientId } = c.req.param();

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Vérifier la relation entre le pro et le patient
    const relationExists = await db
      .select()
      .from(patientProRelations)
      .where(
        and(
          eq(patientProRelations.proId, userId),
          eq(patientProRelations.patientId, patientId)
        )
      )
      .then((result) => result.length > 0);

    if (!relationExists) {
      return c.json(
        { error: "Access denied: No relation with this patient" },
        403
      );
    }

    const [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId));

    return c.json(patient);
  });

export default patientsRoutes;
