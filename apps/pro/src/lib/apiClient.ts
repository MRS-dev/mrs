// src/lib/apiClient.ts
import { AppType } from "../../../server/src/index";
import { hc } from "hono/client";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_SERVER_URL!, {
  init: {
    credentials: "include", // pour inclure les cookies si nécessaire
  },
});
