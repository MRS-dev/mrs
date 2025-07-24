#!/usr/bin/env tsx
import "dotenv/config";
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function addAuthorTypeToExercises() {
  console.log("🚀 Ajout de la colonne author_type à la table exercises...");

  try {
    // Vérifier si la colonne existe déjà
    const columnExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'exercises' 
      AND column_name = 'author_type'
    `);

    if (columnExists.rows.length > 0) {
      console.log("✅ La colonne author_type existe déjà");
      return;
    }

    // Ajouter la colonne author_type avec une valeur par défaut
    await db.execute(sql`
      ALTER TABLE exercises 
      ADD COLUMN author_type TEXT DEFAULT 'doctor' 
      CHECK (author_type IN ('admin', 'doctor'))
    `);

    console.log("✅ Colonne author_type ajoutée à la table exercises");

    // Mettre à jour les exercices existants en fonction du rôle de l'utilisateur
    // Pour cela, on va d'abord identifier les admins
    await db.execute(sql`
      UPDATE exercises 
      SET author_type = 'admin' 
      WHERE author_id IN (
        SELECT ap.id 
        FROM admin_profiles ap
      )
    `);

    console.log("✅ Exercices existants mis à jour selon le rôle de l'auteur");

    // Ajouter un commentaire pour la documentation
    await db.execute(sql`
      COMMENT ON COLUMN exercises.author_type IS 'Type d auteur: admin ou doctor'
    `);

    console.log("✅ Commentaire ajouté");
    console.log("🎉 Migration de la colonne author_type terminée avec succès!");

  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la colonne author_type:", error);
    process.exit(1);
  }
}

// Exécuter la migration
addAuthorTypeToExercises()
  .then(() => {
    console.log("✅ Script de migration terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Échec de la migration:", error);
    process.exit(1);
  });