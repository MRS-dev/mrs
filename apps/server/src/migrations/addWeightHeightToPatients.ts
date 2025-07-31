#!/usr/bin/env tsx
import "dotenv/config";
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function addWeightHeightToPatients() {
  console.log("🚀 Starting migration: Add weight and height columns to patients table");
  
  try {
    // Ajouter les colonnes weight et height à la table patients
    await db.execute(sql`
      ALTER TABLE patients 
      ADD COLUMN IF NOT EXISTS weight TEXT,
      ADD COLUMN IF NOT EXISTS height TEXT;
    `);
    
    console.log("✅ Migration completed successfully: weight and height columns added to patients table");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Exécuter la migration si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  addWeightHeightToPatients()
    .then(() => {
      console.log("🎉 Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration script failed:", error);
      process.exit(1);
    });
}

export { addWeightHeightToPatients };