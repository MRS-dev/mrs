#!/usr/bin/env tsx
import "dotenv/config";
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function addPhoneNumber2ToPatients() {
  console.log("🚀 Ajout de la colonne phone_number2 à la table patients...");

  try {
    // Vérifier si la colonne existe déjà
    const columnExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'patients' 
      AND column_name = 'phone_number2'
    `);

    if (columnExists.rows.length > 0) {
      console.log("✅ La colonne phone_number2 existe déjà");
      return;
    }

    // Ajouter la colonne phone_number2
    await db.execute(sql`
      ALTER TABLE patients 
      ADD COLUMN phone_number2 TEXT
    `);

    console.log("✅ Colonne phone_number2 ajoutée à la table patients");

    // Ajouter un commentaire pour la documentation
    await db.execute(sql`
      COMMENT ON COLUMN patients.phone_number2 IS 'Numéro de téléphone secondaire du patient'
    `);

    console.log("✅ Commentaire ajouté");
    console.log("🎉 Migration de la colonne phone_number2 terminée avec succès!");

  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la colonne phone_number2:", error);
    process.exit(1);
  }
}

// Exécuter la migration
addPhoneNumber2ToPatients()
  .then(() => {
    console.log("✅ Script de migration terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Échec de la migration:", error);
    process.exit(1);
  });