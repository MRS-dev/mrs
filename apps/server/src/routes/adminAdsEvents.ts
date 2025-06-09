import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { roles } from "../lib/roles";
import { adEvents } from "../schemas/adEvents";
import { eq, and, sql } from "drizzle-orm";

const adminAdEvents = new Hono<HonoType>()
  .basePath("/admins/ad-events")
  .use(roles("admin"))

  // Stats des 7 derniers jours pour une publicité donnée
  .get("/stats/:id", async (c) => {
    const adId = c.req.param("id");

    // Regroupement par jour sur les 7 derniers jours
    const rows = await db
      .select({
        date: sql`to_char(date_trunc('day', ${adEvents.createdAt}), 'YYYY-MM-DD')`,
        count: sql`count(*)::int`,
      })
      .from(adEvents)
      .where(
        and(
          eq(adEvents.adId, adId),
          sql`${adEvents.createdAt} > now() - interval '7 days'`
        )
      )
      .groupBy(sql`date_trunc('day', ${adEvents.createdAt})`)
      .orderBy(sql`date_trunc('day', ${adEvents.createdAt})`);

    // Transformation du résultat pour l'API
    const stats = rows.map((r) => ({
      date: r.date as string,
      count: r.count as number,
    }));

    return c.json(stats);
  });

export default adminAdEvents;
