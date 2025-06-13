import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { adEvents } from "../schemas/adEvents";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ads } from "../schemas/ads";
import { eq, sql } from "drizzle-orm";

const logAdEventSchema = z.object({
  adId: z.string().uuid(),
  type: z.enum(["view", "click"]),
});

const adEventsRoutes = new Hono<HonoType>()
  .basePath("/adEvents")
  .post("/log", zValidator("json", logAdEventSchema), async (c) => {
    const { adId, type } = c.req.valid("json");
    await db.insert(adEvents).values({ adId, type });

    if (type === "view") {
      await db
        .update(ads)
        .set({ views: sql`${ads.views} + 1` })
        .where(eq(ads.id, adId));
    }
    if (type === "click") {
      await db
        .update(ads)
        .set({ clicks: sql`${ads.clicks} + 1` })
        .where(eq(ads.id, adId));
    }

    return c.json({ success: true });
  });

export default adEventsRoutes;
