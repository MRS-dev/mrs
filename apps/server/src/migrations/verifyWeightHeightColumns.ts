#!/usr/bin/env tsx
import "dotenv/config";
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function verifyWeightHeightColumns() {
  console.log("🔍 Vérification des colonnes weight et height...");
  
  try {
    // Vérifier que les colonnes existent
    const result = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'patients' 
      AND column_name IN ('weight', 'height');
    `);
    
    console.log("📊 Colonnes trouvées:", result.rows);
    
    if (result.rows.length === 2) {
      console.log("✅ Les colonnes weight et height ont été ajoutées avec succès!");
    } else {
      console.log("❌ Certaines colonnes sont manquantes");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
}

verifyWeightHeightColumns();