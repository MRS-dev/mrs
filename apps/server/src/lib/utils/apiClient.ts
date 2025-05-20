// src/lib/apiClient.ts

import { hc } from "hono/client";
import { AppType } from "../../index";

export const client = hc<AppType>("http://localhost:3000", {
  init: {
    credentials: "include", // pour inclure les cookies si nécessaire
  },
});
