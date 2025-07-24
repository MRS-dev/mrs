#!/usr/bin/env tsx
import "dotenv/config";
import { db } from "../lib/db";
import { chats } from "../schemas/chats";
import { user } from "../schemas/auth";
import { eq, like, sql } from "drizzle-orm";

async function runMigration() {
  console.log("🚀 Début de la migration du système de chat de support...");

  try {
    // Étape 1: Ajouter les colonnes à la table chats
    console.log("📝 Ajout des colonnes is_support et support_user_id...");
    
    await db.execute(sql`
      ALTER TABLE chats 
      ADD COLUMN IF NOT EXISTS is_support BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS support_user_id UUID REFERENCES "user"(id);
    `);

    // Ajouter les index
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_chats_is_support ON chats(is_support);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_chats_support_user_id ON chats(support_user_id);
    `);

    console.log("✅ Colonnes ajoutées avec succès");

    // Étape 2: Migrer les chats de support existants
    console.log("🔄 Migration des chats de support existants...");
    
    const existingSupportChats = await db
      .select()
      .from(chats)
      .where(like(chats.title, "Support - %"));

    console.log(`📊 Trouvé ${existingSupportChats.length} chats de support potentiels`);

    for (const chat of existingSupportChats) {
      // Extraire le nom du professionnel depuis le titre
      const titleMatch = chat.title.match(/^Support - (.+)$/);
      if (titleMatch) {
        const fullName = titleMatch[1];
        console.log(`🔍 Recherche du professionnel: ${fullName}`);

        // Chercher le professionnel dans la table user avec le rôle "pro"
        const professionals = await db
          .select({ id: user.id, name: user.name, email: user.email })
          .from(user)
          .where(eq(user.role, "pro"));

        // Essayer de trouver le bon professionnel basé sur le nom
        let matchedPro = null;
        for (const pro of professionals) {
          if (pro.name && fullName.includes(pro.name)) {
            matchedPro = pro;
            break;
          }
        }

        if (matchedPro) {
          await db
            .update(chats)
            .set({
              isSupport: true,
              supportUserId: matchedPro.id,
            })
            .where(eq(chats.id, chat.id));

          console.log(`✅ Chat "${chat.title}" migré pour ${matchedPro.name} (${matchedPro.email})`);
        } else {
          // Si aucun match exact, marquer quand même comme chat de support mais sans associer d'utilisateur
          await db
            .update(chats)
            .set({
              isSupport: true,
              supportUserId: null,
            })
            .where(eq(chats.id, chat.id));

          console.log(`⚠️ Chat "${chat.title}" marqué comme support mais aucun pro associé trouvé`);
        }
      }
    }

    // Étape 3: S'assurer que tous les admins sont dans tous les chats de support
    console.log("👥 Ajout des admins aux chats de support...");

    const admins = await db
      .select({ id: user.id, name: user.name })
      .from(user)
      .where(eq(user.role, "admin"));

    console.log(`📋 Trouvé ${admins.length} administrateurs`);

    const supportChats = await db
      .select()
      .from(chats)
      .where(eq(chats.isSupport, true));

    console.log(`💬 Trouvé ${supportChats.length} chats de support`);

    for (const chat of supportChats) {
      let updated = false;
      const currentParticipants = chat.participants || [];
      const newParticipants = [...currentParticipants];

      for (const admin of admins) {
        if (!newParticipants.includes(admin.id)) {
          newParticipants.push(admin.id);
          updated = true;
        }
      }

      if (updated) {
        await db
          .update(chats)
          .set({
            participants: newParticipants,
            lastUpdated: new Date(),
          })
          .where(eq(chats.id, chat.id));

        const addedCount = newParticipants.length - currentParticipants.length;
        console.log(`✅ Ajouté ${addedCount} admin(s) au chat "${chat.title}"`);
      }
    }

    // Étape 4: Vérification finale
    console.log("🔍 Vérification finale...");

    const finalSupportChats = await db
      .select({
        id: chats.id,
        title: chats.title,
        isSupport: chats.isSupport,
        supportUserId: chats.supportUserId,
        participantCount: sql`array_length(${chats.participants}, 1)`,
      })
      .from(chats)
      .where(eq(chats.isSupport, true));

    console.log("\n📊 Résumé de la migration:");
    console.log(`✅ ${finalSupportChats.length} chats de support configurés`);
    
    for (const chat of finalSupportChats) {
      console.log(`   - "${chat.title}": ${chat.participantCount} participants`);
    }

    console.log("\n🎉 Migration terminée avec succès!");

  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  }
}

// Exécuter la migration
runMigration()
  .then(() => {
    console.log("✅ Script de migration terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Échec de la migration:", error);
    process.exit(1);
  });