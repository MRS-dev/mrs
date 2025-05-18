// src/lib/apiClient.ts
import { AppType } from "../../server/src/index";
import { hc } from "hono/client";

export const client = hc<AppType>("http://localhost:3000", {
  init: {
    credentials: "include", // pour inclure les cookies si nécessaire
  },
});
