import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { zValidator } from "@hono/zod-validator";
import { eq, sql } from "drizzle-orm";
import { roles } from "../lib/roles";
import { ads } from "../schemas/ads";
import { z } from "zod";

import {
  getQueryPagination,
  paginationSchema,
  toPaginatedResponse,
} from "../lib/utils/paginations";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

// Zod schemas for ad insertion and update
export const adInsertSchema = createInsertSchema(ads);
export const adUpdateSchema = createUpdateSchema(ads);

const adEnableSchema = z.object({
  enable: z.boolean(),
});

const adminAdsRoutes = new Hono<HonoType>()
  .basePath("/admins/ads")
  .use(roles("admin"))

  // List ads with pagination
  .get("/", zValidator("query", paginationSchema), async (c) => {
    const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

    // Total count of ads
    const totalResult = await db.select({ count: sql`COUNT(*)` }).from(ads);
    const totalCount = Number(totalResult[0]?.count ?? 0);

    // Paginated fetch
    const items = await db.select().from(ads).limit(limit).offset(offset);

    return c.json(toPaginatedResponse({ items, totalCount, page, limit }));
  })

  // Get single ad by ID
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await db.select().from(ads).where(eq(ads.id, id));

    if (result.length === 0) {
      return c.text("Ad not found", 404);
    }
    return c.json(result[0]);
  })

  // Create new ad
  .post("/", zValidator("json", adInsertSchema), async (c) => {
    const data = c.req.valid("json");
    const [inserted] = await db.insert(ads).values(data).returning();
    return c.json(inserted);
  })

  // Update an existing ad
  .put("/:id", zValidator("json", adUpdateSchema), async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const updateResult = await db.update(ads).set(data).where(eq(ads.id, id));

    // Check row count
    if (updateResult.rowCount === 0) {
      return c.text("Ad not found", 404);
    }

    const updated = await db.select().from(ads).where(eq(ads.id, id));
    return c.json(updated[0]);
  })

  .patch("/:id", zValidator("json", adEnableSchema), async (c) => {
    const id = c.req.param("id");
    const { enable } = c.req.valid("json");

    const updateResult = await db
      .update(ads)
      .set({ enable })
      .where(eq(ads.id, id));

    if (updateResult.rowCount === 0) {
      return c.text("Ad not found", 404);
    }

    const updated = await db.select().from(ads).where(eq(ads.id, id));
    return c.json(updated[0]);
  })

  // Delete an ad
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const deleteResult = await db.delete(ads).where(eq(ads.id, id));

    if (deleteResult.rowCount === 0) {
      return c.text("Ad not found", 404);
    }
    return c.status(204);
  });

export default adminAdsRoutes;
