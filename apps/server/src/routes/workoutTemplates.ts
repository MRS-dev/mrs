import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { zValidator } from "@hono/zod-validator";
import { eq, sql } from "drizzle-orm";
import { roles } from "../lib/roles";
import { activities } from "../schemas/activities";
import {
  getQueryPagination,
  paginationSchema,
  toPaginatedResponse,
} from "../lib/utils/paginations";

const workoutTemplatesRoutes = new Hono<HonoType>()
  .basePath("/workout-templates")
  .use(roles("pro"))
  .get("/", zValidator("query", paginationSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Get total count of activities
    const totalActivities = await db
      .select({ count: sql`COUNT(*)` })
      .from(activities)
      .then((result) => result[0]?.count || 0);

    // Get paginated list of activities
    const activitiesList = await db
      .select()
      .from(activities)
      .limit(limit)
      .offset(offset);

    return c.json(
      toPaginatedResponse({
        items: activitiesList,
        totalCount: Number(totalActivities),
        page,
        limit,
      })
    );
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const activity = await db
      .select()
      .from(activities)
      .where(eq(workoutTemplates.id, id));
    return c.json(workoutTemplate);
  });

export default workoutTemplatesRoutes;
