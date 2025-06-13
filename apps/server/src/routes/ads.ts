import { Hono } from "hono";
import { type HonoType } from "../lib/auth";
import { db } from "../lib/db";
import { eq } from "drizzle-orm";
import { roles } from "../lib/roles";
import { ads } from "../schemas/ads";

const adsRoutes = new Hono<HonoType>()
  .basePath("/ads")
  .use(roles("pro"))
  .get("/enabled", async (c) => {
    console.log("➡️  [GET] /ads/enabled ");
    try {
      // Log la requête SQL exécutée (en pseudo)
      console.log("🔍 Recherche des ads enable=true…");
      const enabledAds = await db
        .select()
        .from(ads)
        .where(eq(ads.enable, true))
        .limit(1);

      // Log le résultat de la requête SQL
      console.log("✅ Résultat trouvé:", enabledAds);

      if (!enabledAds || enabledAds.length === 0) {
        console.log("🚫 Aucune pub active trouvée.");
        return c.json({ data: null }, 200);
      }

      // Log la pub renvoyée
      console.log("🟢 Pub enabled renvoyée:", enabledAds[0]);
      return c.json({ data: enabledAds[0] }, 200);
    } catch (error) {
      // Log l'erreur détaillée
      console.error("🔥 Erreur dans GET /ads/enabled:", error);
      return c.json({ error: "Erreur interne serveur" }, 500);
    }
  });

export default adsRoutes;
