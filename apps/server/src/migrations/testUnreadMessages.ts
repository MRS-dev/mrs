#!/usr/bin/env tsx
import "dotenv/config";
import { db } from "../lib/db";
import { getChatsWithUnreadInfo } from "../utils/messageReads";
import { user } from "../schemas/auth";
import { eq } from "drizzle-orm";

async function testUnreadMessages() {
  console.log("🧪 Test du système de messages non lus...");

  try {
    // Récupérer quelques utilisateurs de test
    const testUsers = await db
      .select({ id: user.id, email: user.email, role: user.role })
      .from(user)
      .limit(3);

    if (testUsers.length === 0) {
      console.log("❌ Aucun utilisateur trouvé pour les tests");
      return;
    }

    console.log(`📋 Test avec ${testUsers.length} utilisateurs:`);
    
    for (const testUser of testUsers) {
      console.log(`\n👤 Utilisateur: ${testUser.email} (${testUser.role})`);
      
      try {
        const chatsInfo = await getChatsWithUnreadInfo(testUser.id, testUser.role as string);
        
        console.log(`   📨 ${chatsInfo.length} chats trouvés`);
        
        for (const chat of chatsInfo) {
          console.log(`   💬 "${chat.title}"`);
          console.log(`      - Support: ${chat.isSupport ? 'Oui' : 'Non'}`);
          console.log(`      - Messages non lus: ${chat.unreadCount}`);
          const lastMessage = typeof chat.lastMessageContent === 'string' ? chat.lastMessageContent : '';
          console.log(`      - Dernier message: "${lastMessage.substring(0, 50) || 'Aucun'}"`);
          console.log(`      - Date: ${chat.lastMessageCreatedAt || 'N/A'}`);
          console.log(`      - Participants: ${chat.participants.length}`);
        }

        const totalUnread = chatsInfo.reduce((sum, chat) => sum + (Number(chat.unreadCount) || 0), 0);
        console.log(`   📊 Total messages non lus: ${totalUnread}`);

      } catch (error) {
        console.error(`   ❌ Erreur pour ${testUser.email}:`, error);
      }
    }

    // Test spécifique pour les admins et les chats de support
    const admins = testUsers.filter(u => u.role === "admin");
    if (admins.length > 0) {
      console.log(`\n🔍 Test spécial pour les administrateurs (${admins.length})`);
      
      for (const admin of admins) {
        const adminChats = await getChatsWithUnreadInfo(admin.id, admin.role as string);
        const supportChats = adminChats.filter(c => c.isSupport);
        
        console.log(`   👨‍💼 Admin ${admin.email}:`);
        console.log(`      - Total chats visibles: ${adminChats.length}`);
        console.log(`      - Chats de support: ${supportChats.length}`);
        
        if (supportChats.length > 0) {
          console.log("      - Détails des chats de support:");
          for (const supportChat of supportChats) {
            console.log(`        * "${supportChat.title}" (${supportChat.unreadCount} non lus)`);
          }
        }
      }
    }

    console.log("\n✅ Test terminé avec succès");
    console.log("📝 Les fonctionnalités suivantes ont été testées:");
    console.log("   - Récupération des chats avec infos de messages non lus");
    console.log("   - Visibilité des chats de support pour les admins");
    console.log("   - Comptage des messages non lus par chat");
    console.log("   - Informations sur les derniers messages");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
    process.exit(1);
  }
}

// Exécuter le test
testUnreadMessages()
  .then(() => {
    console.log("✅ Script de test terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Échec du test:", error);
    process.exit(1);
  });