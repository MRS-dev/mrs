import type { MiddlewareHandler } from "hono";
import { auth } from "./auth";
import type { Roles } from "./permissions";

type AllowedRoles = Roles | "authenticated";
export const roles = (...allowedRoles: AllowedRoles[]): MiddlewareHandler => {
  return async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userRole = session.user.role as Roles;

    // Si "authenticated" est demandé, n'importe quel user connecté suffit
    if (allowedRoles.includes("authenticated")) {
      c.set("session", session);
      c.set("user", session.user);
      return await next();
    }

    // Sinon, il faut que son rôle soit autorisé
    if (!allowedRoles.includes(userRole)) {
      return c.json({ error: "Forbidden" }, 403);
    }
    if (roleThatRequire2Fa.includes(userRole)) {
      if (!session.user.twoFactorEnabled) {
        return c.json({ error: "2FA required" }, 403);
      }
    }

    c.set("session", session);
    c.set("user", session.user);
    await next();
  };
};

export const roleHierarchy: Record<Roles, Roles[]> = {
  admin: ["admin", "pro", "user"],
  pro: ["user"],
  user: [],
};

export const roleThatRequire2Fa: Roles[] = ["admin", "pro"];
