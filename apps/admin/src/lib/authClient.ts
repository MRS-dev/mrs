import { createAuthClient } from "better-auth/react";
import {
  adminClient as adminClientPlugin,
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";
import { AuthType } from "../../../server/src/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  basePath: "/api/auth", // ← ici
  fetchOptions: {
    credentials: "include",
  },
  plugins: [twoFactorClient(), inferAdditionalFields<AuthType>()],
});

export const adminClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  basePath: "/api/auth", // ← ici
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    adminClientPlugin(),
    twoFactorClient(),
    inferAdditionalFields<AuthType>(),
  ],
});
