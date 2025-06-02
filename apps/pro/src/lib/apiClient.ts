// src/lib/apiClient.ts
import { AppType } from "../../../server/src/index";
import { hc } from "hono/client";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_SERVER_URL!, {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include", // Required for sending cookies cross-origin
    });
  }) satisfies typeof fetch,
});
