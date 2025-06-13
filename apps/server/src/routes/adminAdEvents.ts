import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { adEvents } from "../schemas/adEvents";
import { roles } from "../lib/roles";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// Optionnel: schéma pour filtrer par date
const statsQuerySchema = z.object({
  from: z.string().optional(), // format YYYY-MM-DD
  to: z.string().optional(),
});

const adminAdEventsRoutes = new Hono<HonoType>()
  .basePath("/admins/adEvents")
  .use(roles("admin")) // Protège la route pour les admins
  .get("/:adId", zValidator("query", statsQuerySchema), async (c) => {
    const { adId } = c.req.param();
    const { from, to } = c.req.valid("query");

    // Filtre optionnel par date
    const conditions = [eq(adEvents.adId, adId)];
    if (from) conditions.push(gte(adEvents.createdAt, from));
    if (to) conditions.push(lte(adEvents.createdAt, to));

    // Récupère tous les events pour cette pub (possibilité de faire un GROUP BY)
    const events = await db
      .select()
      .from(adEvents)
      .where(and(...conditions))
      .orderBy(adEvents.createdAt);

    return c.json({ data: events }, 200);
  });

export default adminAdEventsRoutes;
