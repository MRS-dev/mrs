import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schemas/*.ts",
  dialect: "postgresql", // dossier des migrations
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
