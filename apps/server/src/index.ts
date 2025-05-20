// apps/server/src/index.ts
import "dotenv/config"; // Charge les variables depuis .env dans process.env

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
import { handle } from "hono/vercel";

// Spécifiez 'edge' pour le runtime Edge de Vercel (recommandé)
// Ou 'nodejs' si vous préférez/devez utiliser Node.js
export const runtime = "edge";

const app = new Hono<HonoType>({
  // getPath: (req) => {
  //   const url = new URL(req.url);
  //   const port = url.port; // ex. "3001" ou "3002"
  //   let prefix = "";
  //   if (port === "3001") {
  //     prefix = "/admin";
  //   } else if (port === "3002") {
  //     prefix = "/pro";
  //   }
  //   // Log détaillé de l'URL
  //   console.log("Détails de l'URL :");
  //   console.log("- URL complète:", url.href);
  //   console.log("- Protocole:", url.protocol);
  //   console.log("- Host:", url.host);
  //   console.log("- Hostname:", url.hostname);
  //   console.log("- Port:", url.port);
  //   console.log("- Pathname:", url.pathname);
  //   console.log("- Search:", url.search);
  //   console.log("- Hash:", url.hash);
  //   console.log("- Origin:", url.origin);
  //   // reconstructed pathname: e.g. "/admin/test"
  //   const test = `${prefix}${url.pathname}`;
  //   console.log("Chemin reconstruit:", test);
  //   return test;
  // },
})
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
  .route("/", adminActivitiesRoutes);

app.get("/", (c) => {
  return c.json({ message: "Hello from Hono on Vercel!" });
});

app.get("/users", (c) => {
  // Votre logique pour /api/users
  return c.json([{ id: 1, name: "John Doe" }]);
});

export default handle(app); // Cette méthode est souvent utilisée avec des configurations plus simples de `vercel.json` où le fichier lui-même est la fonction.
// Pour être sûr, vérifiez la documentation la plus récente de Hono pour le déploiement "standalone" sur Vercel Edge.

// Si la méthode ci-dessus ne fonctionne pas comme prévu ou si vous voyez des erreurs
// liées à la manière dont Vercel essaie d'invoquer votre fonction,
// vous pourriez avoir besoin d'une structure de fichier qui ressemble plus à une Vercel Serverless Function.
// Par exemple, si Vercel attend un export par défaut qui est une fonction (req, res), vous pourriez
// avoir besoin d'adapter légèrement.
// Cependant, avec `hono/vercel` et la bonne config `vercel.json`, ça devrait marcher.

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
