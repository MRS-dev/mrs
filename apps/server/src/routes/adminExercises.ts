import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { zValidator } from "@hono/zod-validator";
import { eq, sql } from "drizzle-orm";
import { roles } from "../lib/roles";
import { exercises } from "../schemas/exercises";
import {
  getQueryPagination,
  paginationSchema,
  toPaginatedResponse,
} from "../lib/utils/paginations";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
export const exerciseInsertSchema = createInsertSchema(exercises);
export const exerciseUpdateSchema = createUpdateSchema(exercises);
const adminExercisesRoutes = new Hono<HonoType>()
  .basePath("/admins/exercises")
  .use(roles("admin"))
  .get("/", zValidator("query", paginationSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Get total count of exercises
    const totalExercises = await db
      .select({ count: sql`COUNT(*)` })
      .from(exercises)
      .then((result) => result[0]?.count || 0);

    // Get paginated list of exercises
    const exercisesList = await db
      .select()
      .from(exercises)
      .limit(limit)
      .offset(offset);

    return c.json(
      toPaginatedResponse({
        items: exercisesList,
        totalCount: Number(totalExercises),
        page,
        limit,
      })
    );
  })
  .post(
    "/",
    zValidator(
      "json",
      exerciseInsertSchema.pick({
        title: true,
        description: true,
        photoUrl: true,
        videoUrl: true,
        tags: true,
      })
    ),
    async (c) => {
      const user = c.get("user");
      const userId = user?.id;

      if (!userId) {
        return c.json({ error: "User ID is not defined" }, 400);
      }

      const { title, description, photoUrl, videoUrl, tags } =
        c.req.valid("json");

      const [exercise] = await db
        .insert(exercises)
        .values({
          title,
          description,
          photoUrl,
          videoUrl,
          tags,
          authorId: userId,
          public: true,
        })
        .returning();
      return c.json(exercise);
    }
  )
  .patch(
    "/:id",
    zValidator(
      "json",
      exerciseUpdateSchema.pick({
        title: true,
        description: true,
        photoUrl: true,
        videoUrl: true,
        tags: true,
        public: true,
      })
    ),
    async (c) => {
      const user = c.get("user");
      const userId = user?.id;
      const { id } = c.req.param();

      if (!userId) {
        return c.json({ error: "User ID is not defined" }, 400);
      }

      // Check if exercise exists
      const [existingExercise] = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, id));

      if (!existingExercise) {
        return c.json({ error: "Exercise not found" }, 404);
      }

      // Admins can modify any exercise

      const newValues = c.req.valid("json");

      const [updatedExercise] = await db
        .update(exercises)
        .set(newValues)
        .where(eq(exercises.id, id))
        .returning();

      return c.json(updatedExercise);
    }
  )
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { id } = c.req.param();

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Check if exercise exists
    const [existingExercise] = await db
      .select()
      .from(exercises)
      .where(eq(exercises.id, id));

    if (!existingExercise) {
      return c.json({ error: "Exercise not found" }, 404);
    }

    // Admins can delete any exercise

    await db.delete(exercises).where(eq(exercises.id, id));

    return c.json({ success: true });
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const [exercise] = await db
      .select()
      .from(exercises)
      .where(eq(exercises.id, id));
    return c.json(exercise);
  });

export default adminExercisesRoutes;
