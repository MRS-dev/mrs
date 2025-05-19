// apps/server/src/index.ts
import "dotenv/config"; // Charge les variables depuis .env dans process.env

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth, type HonoType } from "./lib/auth";
import authRoutes from "./routes/auth";
import testRoutes from "./routes/test";
import { cors } from "hono/cors";
import adminRoutes from "./routes/admins";
import invitationsRoutes from "./routes/invitations";
import registrationRequestRoutes from "./routes/registrationRequests";
import patientsRoutes from "./routes/patients";
import exercisesRoutes from "./routes/exercises";
import activitiesRoutes from "./routes/activities";
import workoutTemplatesRoutes from "./routes/workoutTemplates";
import workoutSessionsRoutes from "./routes/workoutSession";
import messagesRoutes from "./routes/messages";
import chatsRoutes from "./routes/chats";
// Exemple de route RPC
const app = new Hono<HonoType>()
  .use(
    "/api/*",
    cors({
      origin: ["http://localhost:3002", "http://localhost:3001"], // ou liste de domaines autorisés
      allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"], // inclure OPTIONS
      allowHeaders: ["Content-Type", "Authorization"], // selon tes besoins
      credentials: true,
    })
  )
  .basePath("/api")
  .route("/", authRoutes)
  .route("/", testRoutes)
  .route("/", adminRoutes)
  .route("/", invitationsRoutes)
  .route("/", registrationRequestRoutes)
  .route("/", patientsRoutes)
  .route("/", exercisesRoutes)
  .route("/", activitiesRoutes)
  .route("/", workoutTemplatesRoutes)
  .route("/", workoutSessionsRoutes)
  .route("/", messagesRoutes)
  .route("/", chatsRoutes);

export type AppType = typeof app;

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
