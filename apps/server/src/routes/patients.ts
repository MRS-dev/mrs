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
import {
  createPatientSchema,
  updatePatientSchema,
} from "../validations/patients";
import { z } from "zod";
import { invitations } from "../schemas/invitations";
import { sendMail } from "../mail/mailer";
import { mailTemplate } from "../mail/templates";
import { pros } from "../schemas/pros";

const patientsRoutes = new Hono<HonoType>()
  .basePath("/patients")
  .use("*", roles("pro"))
  .get(
    "/",
    zValidator(
      "query",
      paginationSchema.extend({
        search: z.string().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const userId = user?.id;
      const { search } = c.req.valid("query");
      const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

      if (!userId) {
        return c.json({ error: "User ID is not defined" }, 400);
      }

      const searchQuery = search ? `%${search}%` : null;
      // Get the total count of patients
      const totalPatients = await db
        .select({ count: sql`COUNT(*)` })
        .from(patientProRelations)
        .where(
          and(
            eq(patientProRelations.proId, userId),
            searchQuery
              ? sql`(patients.first_name ILIKE ${searchQuery} OR patients.last_name ILIKE ${searchQuery})`
              : sql`1=1`
          )
        )
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
        .where(
          and(
            eq(patientProRelations.proId, userId),
            searchQuery
              ? sql`(patients.first_name ILIKE ${searchQuery} OR patients.last_name ILIKE ${searchQuery})`
              : sql`1=1`
          )
        )
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
    }
  )
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
  })
  .post("/", zValidator("json", createPatientSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const data = c.req.valid("json");

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    const [patient] = await db
      .insert(patients)
      .values({
        ...data,
        status: "created",
      })
      .returning();
    await db.insert(patientProRelations).values({
      patientId: patient.id,
      proId: userId,
    });
    const [pro] = await db.select().from(pros).where(eq(pros.id, userId));
    const res = await db
      .insert(invitations)
      .values({
        email: data.email,
        invitedBy: c.get("user")?.id,
        role: "user",
      })
      .returning();
    const token = res[0].token;
    await sendMail({
      to: data.email,
      ...mailTemplate.proInvitePatientEmail({
        email: data.email,
        token,
        proName: `${pro.firstName} ${pro.lastName}`,
      }),
    });
    return c.json(patient);
  })
  .put("/:patientId", zValidator("json", updatePatientSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { patientId } = c.req.param();
    const data = c.req.valid("json");

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    const patient = await db
      .update(patients)
      .set(data)
      .where(eq(patients.id, patientId))
      .returning();
    return c.json(patient);
  });

export default patientsRoutes;
