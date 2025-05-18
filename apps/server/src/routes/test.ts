import { Hono } from "hono";
import type { HonoType } from "../lib/auth";
const testRoutes = new Hono<HonoType>()
  // Liste publique des campagnes avec pagination et filtres
  .get("/test", async (c) => {
    return c.json({ message: "Hello World" });
  });

export default testRoutes;
