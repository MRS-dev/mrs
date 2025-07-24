import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { roles } from "../lib/roles";
import { db } from "../lib/db";
import { eq, sql, and, or, desc, inArray } from "drizzle-orm";
import { notifications, notificationReads } from "../schemas/notifications";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  getQueryPagination,
  paginationSchema,
  toPaginatedResponse,
} from "../lib/utils/paginations";

// Schémas de validation
const createNotificationSchema = z.object({
  userId: z.string().optional(),
  role: z.enum(["admin", "pro", "user"]).optional(),
  type: z.string(),
  title: z.string(),
  content: z.string(),
});

const markAsReadSchema = z.object({
  notificationIds: z.array(z.string()).optional(),
  markAllAsRead: z.boolean().optional(),
});

const notificationsRoutes = new Hono<HonoType>()
  .basePath("/notifications")
  .use("*", roles("authenticated"))

  // Créer une nouvelle notification
  .post(
    "/",
    roles("admin"),
    zValidator("json", createNotificationSchema),
    async (c) => {
      const { userId, role, type, title, content } = c.req.valid("json");

      const [notification] = await db
        .insert(notifications)
        .values({
          userId: userId || null,
          role: role || null,
          type,
          title,
          content,
        })
        .returning();

      return c.json(notification, 201);
    }
  )

  // Récupérer les notifications pour l'utilisateur connecté
  .get("/", zValidator("query", paginationSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const userRole = user?.role;

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    const { page, limit, offset } = getQueryPagination(c.req.valid("query"));

    // Récupérer les notifications pour cet utilisateur
    // 1. Notifications spécifiques à l'utilisateur
    // 2. Notifications pour le rôle de l'utilisateur
    // 3. Notifications globales (userId et role sont null)
    const userNotifications = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        title: notifications.title,
        content: notifications.content,
        createdAt: notifications.createdAt,
        isPersonallyRead: sql<boolean>`
          CASE 
            WHEN ${notifications.userId} IS NOT NULL THEN ${notifications.isRead}
            ELSE EXISTS(
              SELECT 1 FROM ${notificationReads} 
              WHERE ${notificationReads.notificationId} = ${notifications.id} 
              AND ${notificationReads.userId} = ${userId}
            )
          END
        `.as("isPersonallyRead"),
      })
      .from(notifications)
      .where(
        or(
          eq(notifications.userId, userId), // Notifications personnelles
          eq(notifications.role, userRole as string), // Notifications par rôle
          and(
            sql`${notifications.userId} IS NULL`,
            sql`${notifications.role} IS NULL`
          ) // Notifications globales
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    // Compter le total
    const totalCount = await db
      .select({ count: sql`COUNT(*)` })
      .from(notifications)
      .where(
        or(
          eq(notifications.userId, userId),
          eq(notifications.role, userRole as string),
          and(
            sql`${notifications.userId} IS NULL`,
            sql`${notifications.role} IS NULL`
          )
        )
      )
      .then((result) => Number(result[0]?.count || 0));

    return c.json(
      toPaginatedResponse({
        items: userNotifications,
        totalCount,
        page,
        limit,
      })
    );
  })

  // Compter les notifications non lues
  .get("/unread-count", async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const userRole = user?.role;

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    const unreadCount = await db
      .select({ count: sql`COUNT(*)` })
      .from(notifications)
      .where(
        and(
          or(
            eq(notifications.userId, userId),
            eq(notifications.role, userRole as string),
            and(
              sql`${notifications.userId} IS NULL`,
              sql`${notifications.role} IS NULL`
            )
          ),
          sql`
            CASE 
              WHEN ${notifications.userId} IS NOT NULL THEN ${notifications.isRead} = false
              ELSE NOT EXISTS(
                SELECT 1 FROM ${notificationReads} 
                WHERE ${notificationReads.notificationId} = ${notifications.id} 
                AND ${notificationReads.userId} = ${userId}
              )
            END
          `
        )
      )
      .then((result) => Number(result[0]?.count || 0));

    return c.json({ unreadCount });
  })

  // Marquer des notifications comme lues
  .patch("/mark-as-read", zValidator("json", markAsReadSchema), async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const userRole = user?.role;
    const { notificationIds, markAllAsRead } = c.req.valid("json");

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    if (markAllAsRead) {
      // Marquer toutes les notifications comme lues
      // 1. Mettre à jour les notifications personnelles
      await db
        .update(notifications)
        .set({ isRead: true, updatedAt: new Date().toISOString() })
        .where(eq(notifications.userId, userId));

      // 2. Insérer des enregistrements de lecture pour les notifications globales/par rôle
      const globalAndRoleNotifications = await db
        .select({ id: notifications.id })
        .from(notifications)
        .leftJoin(
          notificationReads,
          and(
            eq(notificationReads.notificationId, notifications.id),
            eq(notificationReads.userId, userId)
          )
        )
        .where(
          and(
            or(
              eq(notifications.role, userRole as string),
              and(
                sql`${notifications.userId} IS NULL`,
                sql`${notifications.role} IS NULL`
              )
            ),
            sql`${notificationReads.id} IS NULL` // Pas encore marqué comme lu
          )
        );

      if (globalAndRoleNotifications.length > 0) {
        await db.insert(notificationReads).values(
          globalAndRoleNotifications.map((notif) => ({
            notificationId: notif.id,
            userId,
          }))
        );
      }
    } else if (notificationIds && notificationIds.length > 0) {
      // Marquer des notifications spécifiques comme lues
      // 1. Mettre à jour les notifications personnelles
      await db
        .update(notifications)
        .set({ isRead: true, updatedAt: new Date().toISOString() })
        .where(
          and(
            inArray(notifications.id, notificationIds),
            eq(notifications.userId, userId)
          )
        );

      // 2. Insérer des enregistrements de lecture pour les notifications globales/par rôle
      const globalAndRoleNotifications = await db
        .select({ id: notifications.id })
        .from(notifications)
        .leftJoin(
          notificationReads,
          and(
            eq(notificationReads.notificationId, notifications.id),
            eq(notificationReads.userId, userId)
          )
        )
        .where(
          and(
            inArray(notifications.id, notificationIds),
            or(
              eq(notifications.role, userRole as string),
              and(
                sql`${notifications.userId} IS NULL`,
                sql`${notifications.role} IS NULL`
              )
            ),
            sql`${notificationReads.id} IS NULL`
          )
        );

      if (globalAndRoleNotifications.length > 0) {
        await db.insert(notificationReads).values(
          globalAndRoleNotifications.map((notif) => ({
            notificationId: notif.id,
            userId,
          }))
        );
      }
    }

    return c.json({ success: true });
  })

  // Supprimer une notification (seulement pour les notifications personnelles)
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const userId = user?.id;
    const notificationId = c.req.param("id");

    if (!userId) {
      return c.json({ error: "User ID is not defined" }, 400);
    }

    // Vérifier que c'est une notification personnelle de l'utilisateur
    const notification = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        )
      )
      .limit(1);

    if (notification.length === 0) {
      return c.json({ error: "Notification not found or not owned by user" }, 404);
    }

    await db.delete(notifications).where(eq(notifications.id, notificationId));

    return c.json({ success: true });
  });

export default notificationsRoutes;