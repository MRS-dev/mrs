import { db } from "../lib/db";
import { chats } from "../schemas/chats";
import { user } from "../schemas/auth";
import { eq, like } from "drizzle-orm";

/**
 * Script de migration pour identifier et marquer les chats de support existants
 * basé sur leur titre qui commence par "Support - "
 */
export async function migrateSupportChats() {
  try {
    console.log("🔄 Début de la migration des chats de support...");

    // Trouver tous les chats qui ressemblent à des chats de support
    const existingSupportChats = await db
      .select()
      .from(chats)
      .where(like(chats.title, "Support - %"));

    console.log(`📊 Trouvé ${existingSupportChats.length} chats de support potentiels`);

    for (const chat of existingSupportChats) {
      // Essayer d'extraire le nom du professionnel depuis le titre
      const titleMatch = chat.title.match(/^Support - (.+)$/);
      if (titleMatch) {
        const fullName = titleMatch[1];
        const [firstName, ...lastNameParts] = fullName.split(' ');
        const lastName = lastNameParts.join(' ');

        // Chercher le professionnel correspondant
        const professional = await db
          .select({ id: user.id })
          .from(user)
          .where(eq(user.role, "pro"))
          .limit(1); // Pour l'exemple, on prend le premier pro trouvé

        if (professional.length > 0) {
          // Mettre à jour le chat pour le marquer comme chat de support
          await db
            .update(chats)
            .set({
              isSupport: true,
              supportUserId: professional[0].id,
            })
            .where(eq(chats.id, chat.id));

          console.log(`✅ Chat "${chat.title}" migré avec succès`);
        } else {
          console.log(`⚠️ Aucun professionnel trouvé pour le chat "${chat.title}"`);
        }
      }
    }

    console.log("✅ Migration des chats de support terminée");
  } catch (error) {
    console.error("❌ Erreur lors de la migration des chats de support:", error);
    throw error;
  }
}

/**
 * Vérifie que tous les admins sont participants des chats de support
 */
export async function ensureAdminsInSupportChats() {
  try {
    console.log("🔄 Vérification des participants admin dans les chats de support...");

    // Récupérer tous les admins
    const admins = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.role, "admin"));

    // Récupérer tous les chats de support
    const supportChats = await db
      .select()
      .from(chats)
      .where(eq(chats.isSupport, true));

    for (const chat of supportChats) {
      let updated = false;
      const currentParticipants = chat.participants || [];

      for (const admin of admins) {
        if (!currentParticipants.includes(admin.id)) {
          currentParticipants.push(admin.id);
          updated = true;
        }
      }

      if (updated) {
        await db
          .update(chats)
          .set({
            participants: currentParticipants,
            lastUpdated: new Date(),
          })
          .where(eq(chats.id, chat.id));

        console.log(`✅ Ajouté ${admins.length - chat.participants.length} admins au chat "${chat.title}"`);
      }
    }

    console.log("✅ Vérification terminée");
  } catch (error) {
    console.error("❌ Erreur lors de la vérification des participants:", error);
    throw error;
  }
}