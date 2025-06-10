import { Hono } from "hono";
import { auth, type HonoType } from "../lib/auth";
import { roles } from "../lib/roles";
import { db } from "../lib/db";
import { zValidator } from "@hono/zod-validator";
import { user } from "../schemas/auth";
import { eq, sql } from "drizzle-orm";
import { invitations } from "../schemas/invitations";
import { z } from "zod";
import { mailTemplate } from "../mail/templates";
import { sendMail } from "../mail/mailer";
import { toPaginatedResponse } from "../lib/utils/paginations";
import { getQueryPagination, paginationSchema } from "../lib/utils/paginations";
import { patients } from "../schemas/patients";

const adminsRoutes = new Hono<HonoType>()
  .basePath("/admins")
  .use("*", roles("authenticated"))
  .get("/", async (c) => {
    const admins = await db
      .select({
        id: user.id,
        firstName: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.role, "admin"));
    return c.json(admins);
  })
  .post(
    "/invite/admin",
    roles("admin", "pro"),
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
        role: z.enum(["admin", "pro", "user"]),
      })
    ),
    async (c) => {
      const { email, role } = await c.req.json();
      const currentUser = c.get("user");
      if (currentUser?.role === "pro" && role !== "user") {
        return c.json({ error: "Unauthorized" }, 401);
      }
      // Vérifier si un utilisateur existe déjà avec cet email
      const existingUser = await db
        .select({ email: user.email })
        .from(user)
        .where(eq(user.email, email));

      if (existingUser?.length > 0) {
        return c.json({ error: "User already exists" }, 400);
      }

      // Vérifier et invalider l'ancienne invitation si elle existe
      const existingInvitation = await db
        .select()
        .from(invitations)
        .where(eq(invitations.email, email));

      if (existingInvitation.length > 0) {
        // Invalider l'ancienne invitation
        if (existingInvitation[0].invalidatedAt) {
          return c.json({ error: "Invitation is already invalidated" }, 400);
        }
        if (existingInvitation[0].acceptedAt) {
          return c.json({ error: "Invitation is already accepted" }, 400);
        }
        await db
          .update(invitations)
          .set({ invalidatedAt: new Date() })
          .where(eq(invitations.email, email));
      }

      const res = await db
        .insert(invitations)
        .values({
          email,
          invitedBy: c.get("user")?.id,
          role,
        })
        .returning();
      const token = res[0].token;
      await sendMail({
        to: email,
        ...mailTemplate.adminInvitationEmail({ email, token }),
      });
      return c.json({ message: "Invitation sent" });
    }
  )
  .post(
    "/",
    roles("admin"),
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
      })
    ),
    async (c) => {
      const { email, password, name } = await c.req.json();
      const admin = await auth.api.createUser({
        body: { email, password, name, role: "admin" },
      });
      return c.json(admin);
    }
  )
  .post(
    "/invite/pro",
    roles("admin"),
    zValidator(
      "json",
      z
        .object({
          email: z.string().email(),
          emailConfirmation: z.string().email(),
          firstName: z.string().min(1),
          lastName: z.string().min(1),
        })
        .refine((data) => data.email === data.emailConfirmation, {
          message: "Emails do not match",
          path: ["emailConfirmation"],
        })
    ),
    async (c) => {
      const { email, firstName, lastName } = await c.req.json();
      await sendMail({
        to: email,
        ...mailTemplate.proInvitationEmail({ email, lastName, firstName }),
      });
      return c.json({ message: "Invitation sent" });
    }
  )
  .get(
    "/patients",
    roles("admin"),
    zValidator("query", paginationSchema),
    async (c) => {
      const user = c.get("user");
      const userId = user?.id;
      const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

      if (!userId) {
        return c.json({ error: "User ID is not defined" }, 400);
      }
      const totalPatients = await db
        .select({ count: sql`COUNT(*)` })
        .from(patients);
      const patientList = await db
        .select({
          id: patients.id,
          firstName: patients.firstName,
          lastName: patients.lastName,
          email: patients.email,
          status: patients.status,
          birthDate: patients.birthDate,
        })
        .from(patients)
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
  );

export default adminsRoutes;
