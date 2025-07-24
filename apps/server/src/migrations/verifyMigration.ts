#!/usr/bin/env tsx
import "dotenv/config";
import { db } from "../lib/db";
import { chats } from "../schemas/chats";
import { user } from "../schemas/auth";
import { eq, sql } from "drizzle-orm";

async function verifyMigration() {
  console.log("🔍 Vérification de la migration...");

  try {
    // Test 1: Vérifier que les nouvelles colonnes existent
    console.log("📋 Test 1: Vérification des colonnes...");
    const testQuery = await db
      .select({
        id: chats.id,
        title: chats.title,
        isSupport: chats.isSupport,
        supportUserId: chats.supportUserId,
        participantCount: sql`array_length(${chats.participants}, 1)`,
      })
      .from(chats)
      .limit(1);

    console.log("✅ Les colonnes is_support et support_user_id sont présentes");

    // Test 2: Compter les chats de support
    const supportChatCount = await db
      .select({ count: sql`COUNT(*)` })
      .from(chats)
      .where(eq(chats.isSupport, true));

    console.log(`✅ ${supportChatCount[0].count} chats de support trouvés`);

    // Test 3: Vérifier les détails des chats de support
    const supportChats = await db
      .select({
        id: chats.id,
        title: chats.title,
        isSupport: chats.isSupport,
        supportUserId: chats.supportUserId,
        participantCount: sql`array_length(${chats.participants}, 1)`,
      })
      .from(chats)
      .where(eq(chats.isSupport, true));

    console.log("\n📊 Détails des chats de support:");
    for (const chat of supportChats) {
      console.log(`   - "${chat.title}"`);
      console.log(`     ID: ${chat.id}`);
      console.log(`     Support: ${chat.isSupport}`);
      console.log(`     Support User ID: ${chat.supportUserId || 'Non défini'}`);
      console.log(`     Participants: ${chat.participantCount}`);
      console.log("");
    }

    // Test 4: Vérifier qu'un admin peut voir les chats de support
    const admins = await db
      .select({ id: user.id, name: user.name })
      .from(user)
      .where(eq(user.role, "admin"))
      .limit(1);

    if (admins.length > 0) {
      const adminId = admins[0].id;
      console.log(`🔍 Test de visibilité pour l'admin: ${admins[0].name} (${adminId})`);

      // Simuler la requête que ferait l'interface admin
      const adminChats = await db
        .select({
          id: chats.id,
          title: chats.title,
          isSupport: chats.isSupport,
          participantCount: sql`array_length(${chats.participants}, 1)`,
        })
        .from(chats)
        .where(
          sql`${chats.participants} @> ARRAY[${adminId}]::uuid[] OR ${chats.isSupport} = true`
        );

      console.log(`✅ L'admin voit ${adminChats.length} chats (incluant tous les chats de support)`);
      
      const supportChatsForAdmin = adminChats.filter(c => c.isSupport);
      console.log(`   - Dont ${supportChatsForAdmin.length} chats de support`);
    }

    console.log("\n🎉 Vérification terminée avec succès !");
    console.log("✅ Le système de chat de support est opérationnel");

  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
    process.exit(1);
  }
}

// Exécuter la vérification
verifyMigration()
  .then(() => {
    console.log("✅ Script de vérification terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Échec de la vérification:", error);
    process.exit(1);
  });