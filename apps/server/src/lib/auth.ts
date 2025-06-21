// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import * as authSchema from "../schemas/auth";
import { admin as adminPlugin, twoFactor } from "better-auth/plugins";
import { db } from "./db";
import { ac, roles } from "../lib/permissions";

import { sendMfaCodeEmail } from "../services/mailer/mails";

export const auth = betterAuth({
  trustedOrigins: [
    process.env.PRO_FRONTEND_URL!,
    process.env.ADMIN_FRONTEND_URL!,
    process.env.PATIENT_FRONTEND_URL!,
    process.env.NEXT_PUBLIC_SERVER_URL!,
  ],
  emailAndPassword: { enabled: true },
  advanced: {
    database: { generateId: false },
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  appName: "Ma routine santé",
  user: {
    additionalFields: {
      lastName: {
        type: "string",
        required: true,
      },
    },
  },
  plugins: [
    adminPlugin({
      ac,
      roles, // seul "pro" est ajouté
      defaultRole: "user", // “user” reste le rôle par défaut
      adminRoles: ["admin"], // “admin” reste le super-admin
    }),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          await sendMfaCodeEmail({
            email: user.email,
            code: otp,
          });
        },
      },
    }),
  ],
});

export type AuthType = typeof auth;
export type HonoType = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};
