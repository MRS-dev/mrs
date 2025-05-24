import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";
import { AuthType } from "../../../server/src/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL!,
  basePath: "/api/auth", // ← ici
  plugins: [twoFactorClient(), inferAdditionalFields<AuthType>()],
});
