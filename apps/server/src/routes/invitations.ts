import { Hono } from "hono";
import { auth, type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { invitations } from "../schemas/invitations";
import { eq, and } from "drizzle-orm";
import type { Roles } from "../lib/permissions";
import { registrationRequests } from "../schemas/registrationRequests";
import { chats } from "../schemas/chats";
import { pros } from "../schemas/pros";
import { patients } from "../schemas/patients";
import { createSupportChat, addAdminToSupportChats } from "../utils/supportChat";
import { createProPatientChat } from "../utils/chatUtils";
import { patientProRelations } from "../schemas/patientProRelations";

const invitationsRoutes = new Hono<HonoType>()
  .basePath("/invitations")
  .post(
    "/admin/accept",
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
        token: z.string(),
        password: z.string().min(8),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      })
    ),
    async (c) => {
      const { email, token, password, firstName, lastName } =
        c.req.valid("json");

      const [invitation] = await db
        .select({
          token: invitations.token,
          email: invitations.email,
          acceptedAt: invitations.acceptedAt,
          role: invitations.role,
        })
        .from(invitations)
        .where(and(eq(invitations.email, email), eq(invitations.token, token)));

      if (!invitation) {
        return c.json({ error: "Invitation not found" }, 404);
      }

      if (invitation.acceptedAt) {
        return c.json({ error: "Invitation already accepted" }, 400);
      }

      if (invitation.token !== token) {
        return c.json({ error: "Invalid token" }, 401);
      }

      if (email !== invitation.email) {
        return c.json({ error: "Wrong email" }, 401);
      }

      try {
        // 1. Créer l'utilisateur admin
        const admin = await auth.api.createUser({
          body: {
            email,
            password,
            role: invitation.role as Roles,
            name: firstName,
            data: {
              lastName,
            },
          },
        });

        // 2. Si c'est un admin, activer automatiquement le 2FA et l'ajouter aux chats de support
        if (invitation.role === "admin") {
          console.log("CREATING USER");
          // Créer une session temporaire pour l'utilisateur
          const session = await auth.api.signInEmail({
            body: {
              email,
              password,
            },
            asResponse: true,
          });
          console.log("CREATED USER", session.headers);
          console.log("ENABLE TWO FACTOR");
          // Activer le 2FA en passant les headers bruts
          const twoFactorData = await auth.api.enableTwoFactor({
            body: {
              password,
            },
            headers: {
              cookie: session.headers?.get("set-cookie") || "",
            },
          });
          console.log("ENABLED TWO FACTOR", twoFactorData);

          // Marquer l'invitation comme acceptée
          await db
            .update(invitations)
            .set({ acceptedAt: new Date() })
            .where(eq(invitations.email, email));

          // Ajouter le nouvel admin à tous les chats de support existants
          await addAdminToSupportChats(admin.user.id);

          console.log("UPDATED INVITATION");
        }

        return c.json({
          user: admin,
          requires2FA: false,
        });
      } catch (error) {
        console.error("Erreur lors de la création de l'admin:", error);
        return c.json({ error: "Erreur lors de la création du compte" }, 500);
      }
    }
  )
  .post(
    "/pro/accept",
    zValidator(
      "json",
      z.object({
        token: z.string(),
        password: z.string().min(8),
        email: z.string().email(),
      })
    ),
    async (c) => {
      const { token, password, email } = c.req.valid("json");

      const [invitation] = await db
        .select({
          id: invitations.id,
          token: invitations.token,
          email: invitations.email,
          acceptedAt: invitations.acceptedAt,
          role: invitations.role,
        })
        .from(invitations)
        .where(and(eq(invitations.email, email), eq(invitations.token, token)));

      const [registrationRequest] = await db
        .select()
        .from(registrationRequests)
        .where(eq(registrationRequests.invitationId, invitation.id));

      if (!invitation) {
        return c.json({ error: "Invitation not found" }, 404);
      }
      if (!registrationRequest) {
        return c.json({ error: "Registration request not found" }, 404);
      }
      console.log("1");
      if (invitation.acceptedAt) {
        return c.json({ error: "Invitation already accepted" }, 400);
      }
      console.log("2");
      if (invitation.token !== token) {
        return c.json({ error: "Invalid token" }, 401);
      }
      console.log("3");
      if (email !== invitation.email) {
        return c.json({ error: "Wrong email" }, 401);
      }

      if (invitation.role === "pro") {
        console.log("CREATING USER");
        const { user } = await auth.api.createUser({
          body: {
            email,
            password,
            role: invitation.role as Roles,
            name: registrationRequest.firstName,
            data: {
              lastName: registrationRequest.lastName,
            },
          },
        });
        console.log("CREATED USER", user);
        // Créer une session temporaire pour l'utilisateur
        const session = await auth.api.signInEmail({
          body: {
            email,
            password,
          },
          asResponse: true,
        });
        console.log("CREATED USER", session.headers);
        console.log("ENABLE TWO FACTOR");
        // Activer le 2FA en passant les headers bruts
        const twoFactorData = await auth.api.enableTwoFactor({
          body: {
            password,
          },
          headers: {
            cookie: session.headers?.get("set-cookie") || "",
          },
        });
        console.log("ENABLED TWO FACTOR", twoFactorData);
        const { firstName, lastName } = registrationRequest;

        await db
          .update(invitations)
          .set({ acceptedAt: new Date() })
          .where(eq(invitations.email, email));
        
        // Créer le professionnel dans la base
        await db.insert(pros).values({
          id: user.id,
          firstName: registrationRequest.firstName,
          lastName: registrationRequest.lastName,
          email: registrationRequest.email,
          phoneNumber: registrationRequest.phoneNumber,
        });

        // Créer le chat de support automatiquement
        await createSupportChat(user.id, firstName, lastName);
        return c.json({
          user,
          requires2FA: false,
        });
      }
    }
  )
  .post(
    "/patient/accept",
    zValidator(
      "json",
      z.object({
        token: z.string(),
        password: z.string().min(8),
        email: z.string().email(),
      })
    ),
    async (c) => {
      const { token, password, email } = c.req.valid("json");

      const [invitation] = await db
        .select()
        .from(invitations)
        .where(and(eq(invitations.email, email), eq(invitations.token, token)));

      if (!invitation) {
        return c.json({ error: "Invitation not found" }, 404);
      }

      if (invitation.acceptedAt) {
        return c.json({ error: "Invitation already accepted" }, 400);
      }

      if (invitation.token !== token) {
        return c.json({ error: "Invalid token" }, 401);
      }

      if (email !== invitation.email) {
        return c.json({ error: "Wrong email" }, 401);
      }
      const [patient] = await db
        .select()
        .from(patients)
        .where(eq(patients.email, email));

      const { user } = await auth.api.createUser({
        body: {
          email,
          password,
          role: "user" as Roles,
          name: patient.firstName,
          data: {
            lastName: patient.lastName,
          },
        },
      });

      await db
        .update(invitations)
        .set({ acceptedAt: new Date() })
        .where(eq(invitations.email, email));
      
      const [updatedPatient] = await db
        .update(patients)
        .set({
          userId: user.id,
        })
        .where(eq(patients.email, email))
        .returning();

      // Maintenant que le patient a un userId, créer le chat avec son pro
      try {
        // Récupérer l'ID du pro qui a invité ce patient
        const [relation] = await db
          .select({ proId: patientProRelations.proId })
          .from(patientProRelations)
          .where(eq(patientProRelations.patientId, updatedPatient.id));

        if (relation?.proId) {
          await createProPatientChat(relation.proId, updatedPatient.id);
          console.log("Chat created successfully between pro and patient after invitation acceptance");
        } else {
          console.warn("No pro-patient relation found for patient", updatedPatient.id);
        }
      } catch (chatError) {
        console.error("Failed to create chat after patient invitation acceptance:", chatError);
        // Ne pas faire échouer l'acceptation d'invitation si le chat échoue
      }

      return c.json(user);
    }
  );
export default invitationsRoutes;
