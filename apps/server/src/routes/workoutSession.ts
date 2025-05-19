import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { zValidator } from "@hono/zod-validator";
import { and, eq, sql, or, inArray, lt, gt } from "drizzle-orm";
import { roles } from "../lib/roles";
import {
  getQueryPagination,
  paginationSchema,
  toPaginatedResponse,
} from "../lib/utils/paginations";
import { workoutSessions } from "../schemas/workoutSessions";
import { z } from "zod";
import {
  createWorkoutSessionSchema,
  createWorkoutSessionWithDatesSchema,
  updateWorkoutSessionSchema,
} from "../validations/workoutSessions";

const workoutSessionsRoutes = new Hono<HonoType>()
  .basePath("/workout-sessions")
  .use(roles("pro"))
  .get(
    "/",
    zValidator(
      "query",
      paginationSchema.extend({
        patientId: z.string(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const userId = user?.id;
      const { patientId, from, to } = c.req.valid("query");
      const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

      if (!userId) {
        return c.json({ error: "User ID is not defined" }, 400);
      }

      const dateConditions = [];
      if (from) {
        dateConditions.push(gt(workoutSessions.date, new Date(from)));
      }
      if (to) {
        dateConditions.push(lt(workoutSessions.date, new Date(to)));
      }

      const totalWorkoutSessions = await db
        .select({ count: sql`COUNT(*)` })
        .from(workoutSessions)
        .where(
          and(
            or(
              eq(workoutSessions.proId, userId),
              eq(workoutSessions.patientId, patientId)
            ),
            ...dateConditions
          )
        )
        .then((result) => result[0]?.count || 0);

      const workoutSessionsList = await db
        .select()
        .from(workoutSessions)
        .limit(limit)
        .where(
          and(
            eq(workoutSessions.proId, userId),
            eq(workoutSessions.patientId, patientId),
            ...dateConditions
          )
        )
        .offset(offset);

      return c.json(
        toPaginatedResponse({
          items: workoutSessionsList,
          totalCount: Number(totalWorkoutSessions),
          page,
          limit,
        })
      );
    }
  )
  .get("/:id", async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    const { id } = c.req.param();
    const [workoutSession] = await db
      .select()
      .from(workoutSessions)
      .where(
        and(eq(workoutSessions.id, id), eq(workoutSessions.proId, userId))
      );
    return c.json(workoutSession);
  })
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    const userId = user?.id;
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }
    await db
      .delete(workoutSessions)
      .where(
        and(eq(workoutSessions.id, id), eq(workoutSessions.proId, userId))
      );
    return c.json({ message: "Workout session deleted" });
  })
  .post("/", zValidator("json", createWorkoutSessionSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }
    const { date, patientId, program } = c.req.valid("json");
    const workoutSession = await db.insert(workoutSessions).values({
      date,
      patientId,
      proId: userId,
      program,
    });
    return c.json(workoutSession);
  })
  .post(
    "/with-dates",
    zValidator("json", createWorkoutSessionWithDatesSchema),
    async (c) => {
      const { patientId, program, dates } = c.req.valid("json");
      const user = c.get("user");
      const userId = user?.id;

      if (!userId) {
        return c.json({ error: "User ID is not defined" }, 400);
      }

      // Préparation des données pour insertion multiple
      const sessionsToInsert = dates.map((date) => ({
        date: new Date(date), // Convertir string en Date
        patientId,
        proId: userId,
        program,
      }));

      // Insertion multiple en une seule requête
      const sessions = await db
        .insert(workoutSessions)
        .values(sessionsToInsert)
        .returning();

      return c.json(sessions);
    }
  )
  .put("/:id", zValidator("json", updateWorkoutSessionSchema), async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    const userId = user?.id;
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }
    const { date, patientId, program } = c.req.valid("json");
    const workoutSession = await db
      .update(workoutSessions)
      .set({ date, patientId, program })
      .where(
        and(eq(workoutSessions.id, id), eq(workoutSessions.proId, userId))
      );
    return c.json(workoutSession);
  })
  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    const user = c.get("user");
    const userId = user?.id;
    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }
    await db
      .delete(workoutSessions)
      .where(
        and(eq(workoutSessions.id, id), eq(workoutSessions.proId, userId))
      );
    return c.json({ message: "Workout session deleted" });
  })
  .delete(
    "/",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const { ids } = c.req.valid("json");
      const user = c.get("user");
      const userId = user?.id;
      if (!userId) {
        return c.json({ error: "User ID is not defined" }, 400);
      }
      await db
        .delete(workoutSessions)
        .where(
          and(
            inArray(workoutSessions.id, ids),
            eq(workoutSessions.proId, userId)
          )
        );
      return c.json({ message: "Workout sessions deleted" });
    }
  );

export default workoutSessionsRoutes;
