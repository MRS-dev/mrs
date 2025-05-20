import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { zValidator } from "@hono/zod-validator";
import { sql } from "drizzle-orm";
import { roles } from "../lib/roles";
import {
  getQueryPagination,
  paginationSchema,
  toPaginatedResponse,
} from "../lib/utils/paginations";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { pros } from "../schemas/pros";
export const proInsertSchema = createInsertSchema(pros);
export const proUpdateSchema = createUpdateSchema(pros);
const adminProsRoutes = new Hono<HonoType>()
  .basePath("/admins/pros")
  .use(roles("admin"))
  .get("/", zValidator("query", paginationSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Get total count of exercises
    const totalPros = await db
      .select({ count: sql`COUNT(*)` })
      .from(pros)
      .then((result) => result[0]?.count || 0);

    // Get paginated list of exercises
    const prosList = await db.select().from(pros).limit(limit).offset(offset);

    return c.json(
      toPaginatedResponse({
        items: prosList,
        totalCount: Number(totalPros),
        page,
        limit,
      })
    );
  });

export default adminProsRoutes;
