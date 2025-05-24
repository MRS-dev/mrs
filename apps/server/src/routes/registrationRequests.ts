import { Hono } from "hono";
import type { HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { registrationRequests } from "../schemas/registrationRequests";
import { sendAccountRequestConfirmationEmail } from "../services/mailer/mails";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { roles } from "../lib/roles";
import { eq } from "drizzle-orm";
import { mailTemplate } from "../mail/templates";
import { sendMail } from "../mail/mailer";
import { invitations } from "../schemas/invitations";

export function isValidLuhn(number: string): boolean {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    let num = parseInt(number[i], 10);
    if (i % 2 === number.length % 2) num *= 2; // Double les chiffres en position paire (en comptant depuis la droite)
    if (num > 9) num -= 9; // Soustrait 9 si le résultat est supérieur à 9
    sum += num;
  }
  return sum % 10 === 0;
}

const registrationRequestSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
  companyName: z.string().min(1, "Le nom de la société est requis"),
  siret: z
    .string()
    .regex(/^\d{14}$/, "Le numéro SIRET doit contenir exactement 14 chiffres"),
  rpps: z
    .string()
    .regex(/^\d{11}$/, "Le numéro RPPS doit contenir exactement 11 chiffres"),
  cni: z
    .array(
      z
        .any()
        .refine(
          (file) =>
            file &&
            typeof file === "object" &&
            "type" in file &&
            ["image/png", "image/jpeg", "application/pdf"].includes(file.type),
          "Seuls les fichiers PNG, JPEG ou PDF sont acceptés"
        )
    )
    .min(1, "Au moins un fichier CNI est requis")
    .max(3, "Vous pouvez envoyer jusqu'à 3 fichiers CNI"),
  healthCard: z
    .array(
      z
        .any()
        .refine(
          (file) =>
            file &&
            typeof file === "object" &&
            "type" in file &&
            ["image/png", "image/jpeg", "application/pdf"].includes(file.type),
          "Seuls les fichiers PNG, JPEG ou PDF sont acceptés"
        )
    )
    .min(1, "Au moins un fichier HealthCard est requis")
    .max(3, "Vous pouvez envoyer jusqu'à 3 fichiers HealthCard"),
});
const registrationRequestsRoutes = new Hono<HonoType>()
  .basePath("/registration-requests")
  .put("/", zValidator("form", registrationRequestSchema), async (c) => {
    console.log("FORM", c.req);
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      companyName,
      siret,
      rpps,
      cni,
      healthCard,
    } = c.req.valid("form");
    console.log("FORM", c.req);

    const registrationRequest = await db.insert(registrationRequests).values({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      companyName: companyName,
      siret: siret,
      rpps: rpps,
      cni: [""],
      healthCard: [""],
    });
    await sendAccountRequestConfirmationEmail({ email });
    //  sendNotification(
    //    {
    //      type: "new_doctor_request",
    //      content: `Nouvelle demande de compte pour ${firstName} ${lastName}`,
    //    },
    //    { role: "ADMIN" }
    //  );
    return c.json({
      message: "Registration request created successfully",
      data: registrationRequest,
    });
  })
  .get("/", roles("admin"), async (c) => {
    const res = await db.select().from(registrationRequests);
    return c.json({
      data: res,
    });
  })
  .get(
    "/:id",
    roles("admin"),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const [registrationRequest] = await db
        .select()
        .from(registrationRequests)
        .where(eq(registrationRequests.id, id));
      return c.json(registrationRequest);
    }
  )
  .put(
    "/accept",
    roles("admin"),
    zValidator(
      "json",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("json");
      const [existingRegistrationRequest] = await db
        .select()
        .from(registrationRequests)
        .where(eq(registrationRequests.id, id));
      if (existingRegistrationRequest.acceptedAt) {
        return c.json(
          {
            message: "Registration request already accepted",
          },
          400
        );
      }
      const email = existingRegistrationRequest.email;
      const [invitation] = await db
        .insert(invitations)
        .values({
          email,
          invitedBy: c.get("user")?.id,
          role: "pro",
        })
        .returning();
      const res = await db
        .update(registrationRequests)
        .set({ acceptedAt: new Date(), invitationId: invitation.id })
        .where(eq(registrationRequests.id, id));

      const token = invitation.token;
      await sendMail({
        to: email,
        ...mailTemplate.acceptRegistrationRequestEmail(token),
      });

      return c.json({
        message: "Registration request accepted successfully",
      });
    }
  );

export default registrationRequestsRoutes;
