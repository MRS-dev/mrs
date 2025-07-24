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
  .use("*", roles("authenticated"))
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
          email: patients.email,
          birthDate: patients.birthDate,
          phoneNumber: patients.phoneNumber,
          socialSecurityNumber: patients.socialSecurityNumber,
          address: patients.address,
          emergencyContact: patients.emergencyContact,
          allergies: patients.allergies,
          status: patients.status,
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
  .get("/me", async (c) => {
    const user = c.get("user");
    const userId = user?.id || "";
    const [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, userId));
    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }
    return c.json(patient);
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
  })
  .post("/", zValidator("json", createPatientSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const data = c.req.valid("json");

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    try {
      // Vérifier si un patient avec cet email existe déjà
      const existingPatient = await db
        .select()
        .from(patients)
        .where(eq(patients.email, data.email))
        .limit(1);

      if (existingPatient.length > 0) {
        return c.json({ error: "Un patient avec cet email existe déjà" }, 400);
      }

      // Récupérer les infos du pro d'abord
      const [pro] = await db.select().from(pros).where(eq(pros.id, userId));
      if (!pro) {
        return c.json({ error: "Pro not found" }, 404);
      }

      // Créer le patient
      const [patient] = await db
        .insert(patients)
        .values({
          ...data,
          status: "created",
        })
        .returning();

      let invitation = null;
      try {
        // Créer la relation patient-pro
        await db.insert(patientProRelations).values({
          patientId: patient.id,
          proId: userId,
        });

        // Créer l'invitation
        const [createdInvitation] = await db
          .insert(invitations)
          .values({
            email: data.email,
            invitedBy: userId,
            role: "user",
          })
          .returning();
        
        invitation = createdInvitation;
      } catch (relationError) {
        // En cas d'erreur, supprimer le patient créé pour maintenir la cohérence
        console.error("Error creating patient relations:", relationError);
        try {
          await db.delete(patients).where(eq(patients.id, patient.id));
        } catch (cleanupError) {
          console.error("Failed to cleanup patient:", cleanupError);
        }
        throw new Error("Failed to create patient relations");
      }

      const result = { patient, pro, invitation };

      // Envoyer l'email d'invitation (en dehors de la transaction)
      try {
        await sendMail({
          to: data.email,
          ...mailTemplate.proInvitePatientEmail({
            email: data.email,
            token: result.invitation.token,
            proName: `${result.pro.firstName} ${result.pro.lastName}`,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send invitation email:", emailError);
        // L'email a échoué mais le patient est créé
        // On pourrait ajouter une notification ou un retry ici
      }

      return c.json(result.patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      return c.json({ error: "Failed to create patient" }, 500);
    }
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
  })
  .delete("/:patientId", async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { patientId } = c.req.param();

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    try {
      // Vérifier que le pro a une relation avec ce patient
      const relationExists = await db
        .select()
        .from(patientProRelations)
        .where(
          and(
            eq(patientProRelations.proId, userId),
            eq(patientProRelations.patientId, patientId)
          )
        )
        .limit(1);

      if (relationExists.length === 0) {
        return c.json(
          { error: "Access denied: No relation with this patient" },
          403
        );
      }

      // Supprimer d'abord les relations
      await db
        .delete(patientProRelations)
        .where(eq(patientProRelations.patientId, patientId));

      // Récupérer l'email du patient pour supprimer les invitations
      const patientToDelete = await db
        .select({ email: patients.email })
        .from(patients)
        .where(eq(patients.id, patientId))
        .limit(1);

      if (patientToDelete.length > 0) {
        // Supprimer les invitations liées
        await db
          .delete(invitations)
          .where(eq(invitations.email, patientToDelete[0].email));
      }

      // Supprimer le patient
      const [deletedPatient] = await db
        .delete(patients)
        .where(eq(patients.id, patientId))
        .returning();

      if (!deletedPatient) {
        return c.json({ error: "Patient not found" }, 404);
      }

      return c.json({ message: "Patient deleted successfully" });
    } catch (error) {
      console.error("Error deleting patient:", error);
      return c.json({ error: "Failed to delete patient" }, 500);
    }
  });

export default patientsRoutes;
