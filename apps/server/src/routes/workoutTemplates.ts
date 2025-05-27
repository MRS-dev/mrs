import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { zValidator } from "@hono/zod-validator";
import { and, eq, sql, or } from "drizzle-orm";
import { roles } from "../lib/roles";
import {
  getQueryPagination,
  paginationSchema,
  toPaginatedResponse,
} from "../lib/utils/paginations";
import { workoutTemplates } from "../schemas/workoutTemplates";
import {
  createWorkoutTemplateSchema,
  updateWorkoutTemplateSchema,
} from "../validations/workoutTemplates";

const workoutTemplatesRoutes = new Hono<HonoType>()
  .basePath("/workout-templates")
  .use(roles("pro", "admin"))
  .get("/", zValidator("query", paginationSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }
    // Get total count of activities
    const totalWorkoutTemplates = await db
      .select({ count: sql`COUNT(*)` })
      .from(workoutTemplates)
      .where(
        or(
          eq(workoutTemplates.authorId, userId),
          eq(workoutTemplates.public, true)
        )
      )
      .then((result) => result[0]?.count || 0);

    // Get paginated list of activities
    const workoutTemplatesList = await db
      .select()
      .from(workoutTemplates)
      .limit(limit)
      .where(
        or(
          eq(workoutTemplates.authorId, userId),
          eq(workoutTemplates.public, true)
        )
      )
      .offset(offset);

    return c.json(
      toPaginatedResponse({
        items: workoutTemplatesList,
        totalCount: Number(totalWorkoutTemplates),
        page,
        limit,
      })
    );
  })
  .get("/:id", async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    const { id } = c.req.param();
    const [workoutTemplate] = await db
      .select()
      .from(workoutTemplates)
      .where(
        or(
          and(
            eq(workoutTemplates.id, id),
            eq(workoutTemplates.authorId, userId)
          ),
          and(eq(workoutTemplates.id, id), eq(workoutTemplates.public, true))
        )
      );
    return c.json(workoutTemplate);
  })
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    const userId = user?.id;
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }
    await db
      .delete(workoutTemplates)
      .where(
        and(eq(workoutTemplates.id, id), eq(workoutTemplates.authorId, userId))
      );
    return c.json({ message: "Workout template deleted" });
  })
  .post("/", zValidator("json", createWorkoutTemplateSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }
    const { name, program } = c.req.valid("json");
    const workoutTemplate = await db.insert(workoutTemplates).values({
      name,
      program,
      authorId: userId,
      public: user.role === "admin" ? true : false,
    });
    return c.json(workoutTemplate);
  })
  .put("/:id", zValidator("json", updateWorkoutTemplateSchema), async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    const userId = user?.id;
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }
    const { name, program } = c.req.valid("json");
    const workoutTemplate = await db
      .update(workoutTemplates)
      .set({ name, program })
      .where(
        and(eq(workoutTemplates.id, id), eq(workoutTemplates.authorId, userId))
      );
    return c.json(workoutTemplate);
  });

export default workoutTemplatesRoutes;
