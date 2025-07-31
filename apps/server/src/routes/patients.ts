import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { roles } from "../lib/roles";
import { db } from "../lib/db";
import { eq, sql, and, gte, lte, desc } from "drizzle-orm";
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
  updatePatientPersonalInfoSchema,
} from "../validations/patients";
import { z } from "zod";
import { invitations } from "../schemas/invitations";
import { sendMail } from "../mail/mailer";
import { mailTemplate } from "../mail/templates";
import { pros } from "../schemas/pros";
import { workoutSessions } from "../schemas/workoutSessions";
import { createProPatientChat, deleteOldPatientChats } from "../utils/chatUtils";

const patientsRoutes = new Hono<HonoType>()
  .basePath("/patients")
  .use("*", async (c, next) => {
    console.log("🔐 Checking authentication for:", c.req.path);
    const user = c.get("user");
    console.log("🔐 User from middleware:", user);
    return roles("authenticated")(c, next);
  })
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
  // Route de test pour vérifier que les routes patients fonctionnent
  .get("/test", async (c) => {
    return c.json({ message: "Patient routes working" });
  })
  // Routes pour les sessions du patient connecté
  .get("/sessions", zValidator("query", z.object({
    filter: z.object({
      date: z.object({
        from: z.string().optional(),
        to: z.string().optional(),
      }).optional(),
    }).optional(),
  }).optional()), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Trouver le patient correspondant à l'utilisateur connecté
    const [patient] = await db
      .select({ id: patients.id })
      .from(patients)
      .where(eq(patients.userId, userId));

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const query = c.req.valid("query");
    const dateConditions = [];
    
    if (query?.filter?.date?.from) {
      dateConditions.push(gte(workoutSessions.date, new Date(query.filter.date.from)));
    }
    if (query?.filter?.date?.to) {
      dateConditions.push(lte(workoutSessions.date, new Date(query.filter.date.to)));
    }

    const sessions = await db
      .select()
      .from(workoutSessions)
      .where(
        and(
          eq(workoutSessions.patientId, patient.id),
          ...dateConditions
        )
      )
      .orderBy(desc(workoutSessions.date));

    return c.json(sessions);
  })
  .get("/sessions/:sessionId", async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { sessionId } = c.req.param();
    
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Trouver le patient correspondant à l'utilisateur connecté
    const [patient] = await db
      .select({ id: patients.id })
      .from(patients)
      .where(eq(patients.userId, userId));

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    const [session] = await db
      .select()
      .from(workoutSessions)
      .where(
        and(
          eq(workoutSessions.id, sessionId),
          eq(workoutSessions.patientId, patient.id)
        )
      );

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json(session);
  })
  .put("/sessions/:sessionId/exercise-report", zValidator("json", z.any()), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { sessionId } = c.req.param();
    const reportData = c.req.valid("json");
    
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Trouver le patient correspondant à l'utilisateur connecté
    const [patient] = await db
      .select({ id: patients.id })
      .from(patients)
      .where(eq(patients.userId, userId));

    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }

    // Vérifier que la session appartient au patient
    const [session] = await db
      .select()
      .from(workoutSessions)
      .where(
        and(
          eq(workoutSessions.id, sessionId),
          eq(workoutSessions.patientId, patient.id)
        )
      );

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    // Mettre à jour le rapport de la session
    const updatedSession = await db
      .update(workoutSessions)
      .set({
        report: reportData,
        status: "completed"
      })
      .where(eq(workoutSessions.id, sessionId))
      .returning();

    return c.json(updatedSession[0]);
  })
  // Route pour mettre à jour les informations du patient
  .put("/me", zValidator("json", updatePatientPersonalInfoSchema), async (c) => {
    console.log("🚀 PUT /me endpoint called");
    try {
      const user = c.get("user");
      const userId = user?.id;
      const updateData = c.req.valid("json");
      
      console.log("User:", user);
      console.log("UpdateData received:", updateData);
      
      if (!userId) {
        console.log("No userId found");
        return c.json({ error: "User ID is not defined" }, 400);
      }

      // Trouver le patient correspondant à l'utilisateur connecté
      const [patient] = await db
        .select({ id: patients.id })
        .from(patients)
        .where(eq(patients.userId, userId));

      console.log("Patient found:", patient);

      if (!patient) {
        console.log("Patient not found for userId:", userId);
        // Au lieu de retourner une erreur, créons un patient de base
        // Note: En production, ceci devrait être géré différemment
        return c.json({ error: "Patient profile not found. Please contact support to set up your profile." }, 404);
      }

      // Convertir les données selon les types attendus par la base de données
      const dataToUpdate: any = {};
      
      if (updateData.firstName) dataToUpdate.firstName = updateData.firstName;
      if (updateData.lastName) dataToUpdate.lastName = updateData.lastName;
      if (updateData.email) dataToUpdate.email = updateData.email;
      if (updateData.phoneNumber) dataToUpdate.phoneNumber = updateData.phoneNumber;
      if (updateData.address) dataToUpdate.address = updateData.address;
      if (updateData.weight) dataToUpdate.weight = String(updateData.weight);
      if (updateData.height) dataToUpdate.height = String(updateData.height);
      if (updateData.birthDate) dataToUpdate.birthDate = new Date(updateData.birthDate);
      
      console.log("Data to update after conversion:", dataToUpdate);

      // Mettre à jour les informations du patient
      const [updatedPatient] = await db
        .update(patients)
        .set(dataToUpdate)
        .where(eq(patients.id, patient.id))
        .returning();

      console.log("Patient updated:", updatedPatient);
      return c.json(updatedPatient);
    } catch (error) {
      console.error("Error updating patient:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
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
  // Route pour vérifier si un patient existe par email
  .post("/check-email", zValidator("json", z.object({ email: z.string().email() })), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { email } = c.req.valid("json");

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    try {
      // Vérifier si un patient avec cet email existe déjà
      const [existingPatient] = await db
        .select({
          id: patients.id,
          firstName: patients.firstName,
          lastName: patients.lastName,
          email: patients.email,
        })
        .from(patients)
        .where(eq(patients.email, email))
        .limit(1);

      if (existingPatient) {
        return c.json({ 
          exists: true, 
          patient: existingPatient 
        });
      } else {
        return c.json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking patient email:", error);
      return c.json({ error: "Failed to check patient email" }, 500);
    }
  })
  // Route pour reprendre un patient existant
  .post("/take-over", zValidator("json", z.object({ patientId: z.string() })), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { patientId } = c.req.valid("json");

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    try {
      // Vérifier que le patient existe
      const [patient] = await db
        .select()
        .from(patients)
        .where(eq(patients.id, patientId))
        .limit(1);

      if (!patient) {
        return c.json({ error: "Patient not found" }, 404);
      }

      // Supprimer l'ancienne relation patient-pro s'il y en a une
      await db
        .delete(patientProRelations)
        .where(eq(patientProRelations.patientId, patientId));

      // Créer la nouvelle relation patient-pro
      await db.insert(patientProRelations).values({
        patientId: patientId,
        proId: userId,
      });

      // Supprimer les anciens chats du patient (sauf celui avec le nouveau pro)
      await deleteOldPatientChats(patientId, userId);

      // Créer un nouveau chat entre le pro et le patient
      const chat = await createProPatientChat(userId, patientId);

      return c.json({ 
        patient, 
        chat,
        message: "Patient successfully taken over" 
      });

    } catch (error) {
      console.error("Error taking over patient:", error);
      return c.json({ error: "Failed to take over patient" }, 500);
    }
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

        // Note: Le chat sera créé automatiquement quand le patient acceptera l'invitation
        // et aura un userId (voir /invitations/patient/accept)

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
