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
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
export const activityInsertSchema = createInsertSchema(activities);
export const activityUpdateSchema = createUpdateSchema(activities);
const adminActivitiesRoutes = new Hono<HonoType>()
  .basePath("/admins/activities")
  .use(roles("admin"))
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
  .post(
    "/",
    zValidator(
      "json",
      activityInsertSchema.pick({
        title: true,
        description: true,
      })
    ),
    async (c) => {
      const user = c.get("user");
      const userId = user?.id;

      if (!userId) {
        return c.json({ error: "User ID is not defined" }, 400);
      }

      const { title, description } = c.req.valid("json");

      const [activity] = await db
        .insert(activities)
        .values({
          description,
          title,
          authorId: userId,
        })
        .returning();
      return c.json(activity);
    }
  )
  .put(
    "/:id",
    zValidator(
      "json",
      activityUpdateSchema.pick({
        title: true,
        description: true,
      })
    ),
    async (c) => {
      const user = c.get("user");
      const userId = user?.id;
      const { id } = c.req.param();

      if (!userId) {
        return c.json({ error: "User ID is not defined" }, 400);
      }

      const newValues = c.req.valid("json");

      const [updatedActivity] = await db
        .update(activities)
        .set(newValues)
        .where(eq(activities.id, id))
        .returning();

      return c.json(updatedActivity);
    }
  )
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { id } = c.req.param();

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    const [existingActivity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id));

    if (!existingActivity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    if (existingActivity.authorId !== userId) {
      return c.json(
        { error: "You are not authorized to delete this activity" },
        403
      );
    }

    await db.delete(activities).where(eq(activities.id, id));

    return c.json({ success: true });
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const [activity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id));
    return c.json(activity);
  });

export default adminActivitiesRoutes;
