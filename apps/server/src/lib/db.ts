import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
// Vous pourriez vouloir importer vos schémas ici si vous les passez à drizzle
// import * as schema from './schema'; // ou le chemin vers vos schémas

// 1. Initialisez le client Neon avec votre chaîne de connexion
const sql = neon(process.env.DATABASE_URL!);

// 2. Passez le client Neon (sql) à drizzle
// Si vous avez un fichier de schéma combiné, vous pouvez l'ajouter :
// export const db = drizzle(sql, { schema });
// Sinon, pour commencer, sans schéma explicite ici :
export const db = drizzle(sql);
