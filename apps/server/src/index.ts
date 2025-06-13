import "dotenv/config";

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("💥 Unhandled Rejection:", reason);
});

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { type HonoType } from "./lib/auth";
import authRoutes from "./routes/auth";
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
import adminExercisesRoutes from "./routes/adminExercises";
import adminProsRoutes from "./routes/adminPros";
import adminActivitiesRoutes from "./routes/adminActivities";

import { setupSocketHandlers, io } from "./socket";
import userRoutes from "./routes/user";
import adminAdsRoutes from "./routes/adminAds";
import adsRoutes from "./routes/ads";
import adEventsRoutes from "./routes/adEvents";
import adminAdEventsRoutes from "./routes/adminAdEvents";

const app = new Hono<HonoType>()
  .use(
    "/api/*",
    cors({
      origin: [
        process.env.ADMIN_FRONTEND_URL!,
        process.env.PRO_FRONTEND_URL!,
        process.env.PATIENT_FRONTEND_URL!,
      ],
      allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .basePath("/api")
  .route("/", authRoutes)
  .route("/", adminRoutes)
  .route("/", invitationsRoutes)
  .route("/", registrationRequestRoutes)
  .route("/", patientsRoutes)
  .route("/", exercisesRoutes)
  .route("/", activitiesRoutes)
  .route("/", workoutTemplatesRoutes)
  .route("/", workoutSessionsRoutes)
  .route("/", messagesRoutes)
  .route("/", chatsRoutes)
  .route("/", adminExercisesRoutes)
  .route("/", adminProsRoutes)
  .route("/", adminActivitiesRoutes)
  .route("/", adminAdsRoutes)
  .route("/", adsRoutes)
  .route("/", adEventsRoutes)
  .route("/", adminAdEventsRoutes)
  .route("/", userRoutes)
  .get("/health", (c) => c.text("OK"));

const port = process.env.PORT || 3000;

try {
  serve(
    {
      fetch: app.fetch,
      port: Number(port),
      hostname: "0.0.0.0",
    },
    (info) => {
      // On initialise le serveur WebSocket avec l'objet HTTP natif
      io.listen(3003); // utilise un autre port (par exemple 3001)
      setupSocketHandlers(io);

      console.log(`🟢 Server is running on http://0.0.0.0:${info.port}`);
      console.log(`🌱 Environment: ${process.env.NODE_ENV || "development"}`);
      const origin = [
        process.env.ADMIN_FRONTEND_URL!,
        process.env.PRO_FRONTEND_URL!,
        process.env.PATIENT_FRONTEND_URL!,
      ];
      console.log(`🔓 CORS enabled for: ${JSON.stringify(origin)}`);
      console.log(
        `❤️ Health check available at: http://0.0.0.0:${info.port}/api/health`
      );
    }
  );
} catch (error) {
  console.error("🚫 Failed to start server:", error);
  process.exit(1);
}

export type AppType = typeof app;
