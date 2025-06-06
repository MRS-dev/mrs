import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { roles } from "../lib/roles";

const userRoutes = new Hono<HonoType>()
  .basePath("/user")
  .use("*", roles("authenticated"))
  .get("/mfa/status", async (c) => {
    const user = c.get("user");
    console.log("user", user);
    const is2faEnabled = user?.twoFactorEnabled;
    return c.json({ is2faEnabled });
  });

export default userRoutes;
