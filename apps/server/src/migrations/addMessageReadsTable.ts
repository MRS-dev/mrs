#!/usr/bin/env tsx
import "dotenv/config";
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function addMessageReadsTable() {
  console.log("🚀 Création de la table message_reads...");

  try {
    // Créer la table message_reads
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS message_reads (
        user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
        read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, message_id)
      );
    `);

    console.log("✅ Table message_reads créée");

    // Créer les index pour optimiser les performances
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_message_reads_user_id ON message_reads(user_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_message_reads_message_id ON message_reads(message_id);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_message_reads_read_at ON message_reads(read_at);
    `);

    console.log("✅ Index créés");

    // Commentaires pour la documentation
    await db.execute(sql`
      COMMENT ON TABLE message_reads IS 'Table de suivi des messages lus par les utilisateurs'
    `);
    
    await db.execute(sql`
      COMMENT ON COLUMN message_reads.user_id IS 'ID de utilisateur qui a lu le message'
    `);
    
    await db.execute(sql`
      COMMENT ON COLUMN message_reads.message_id IS 'ID du message qui a ete lu'
    `);
    
    await db.execute(sql`
      COMMENT ON COLUMN message_reads.read_at IS 'Timestamp de quand le message a ete lu'
    `);

    console.log("✅ Commentaires ajoutés");
    console.log("🎉 Migration de la table message_reads terminée avec succès!");

  } catch (error) {
    console.error("❌ Erreur lors de la création de la table message_reads:", error);
    process.exit(1);
  }
}

// Exécuter la migration
addMessageReadsTable()
  .then(() => {
    console.log("✅ Script de création de table terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Échec de la migration:", error);
    process.exit(1);
  });