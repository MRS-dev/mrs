// src/lib/apiClient.ts

import { hc } from "hono/client";
import { AppType } from "../../index";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_SERVER_URL!, {
  init: {
    credentials: "include", // pour inclure les cookies si nécessaire
  },
});
