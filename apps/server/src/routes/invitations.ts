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

      console.log("4");
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

      console.log("ADMIN; ", admin);
      await db
        .update(invitations)
        .set({ acceptedAt: new Date() })
        .where(eq(invitations.email, email));
      return c.json(admin);
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

      const { firstName, lastName } = registrationRequest;

      await db
        .update(invitations)
        .set({ acceptedAt: new Date() })
        .where(eq(invitations.email, email));
      await db
        .insert(chats)
        .values({
          participants: [user.id],
          lastUpdated: new Date(),
          title: `Support - ${firstName} ${lastName}`,
        })
        .returning();
      await db.insert(pros).values({
        id: user.id,
        firstName: registrationRequest.firstName,
        lastName: registrationRequest.lastName,
        email: registrationRequest.email,
        phoneNumber: registrationRequest.phoneNumber,
      });

      return c.json(user);
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
      await db
        .update(patients)
        .set({
          userId: user.id,
        })
        .where(eq(patients.email, email));
      return c.json(user);
    }
  );
export default invitationsRoutes;
