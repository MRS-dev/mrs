import { Hono } from "hono";
import { auth } from "../lib/auth";
import type { HonoType } from "../lib/auth";

const authRoutes = new Hono<HonoType>()
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    // Met à null si non connecté
    c.set("user", session?.user ?? null);
    c.set("session", session?.session ?? null);
    await next();
  })
  .on(["GET", "POST"], "auth/*", async (c) => {
    console.log("authRoutes handler invoked for:", c.req.url);
    const test = await auth.handler(c.req.raw);
    console.log("test status", test.status);
    return test;
  })
  .get("auth/session", async (c) => {
    const session = c.get("session");
    const user = c.get("user");

    if (!user) return c.body(null, 401);

    return c.json({
      session,
      user,
    });
  });

export default authRoutes;
