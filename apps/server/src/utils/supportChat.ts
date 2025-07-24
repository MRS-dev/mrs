import { db } from "../lib/db";
import { chats } from "../schemas/chats";
import { user } from "../schemas/auth";
import { eq } from "drizzle-orm";

/**
 * Crée un chat de support pour un professionnel
 * Le chat est visible par tous les admins
 */
export async function createSupportChat(proUserId: string, proFirstName: string, proLastName: string) {
  try {
    // Récupérer tous les admins
    const admins = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.role, "admin"));

    const adminIds = admins.map(admin => admin.id);
    
    // Créer le chat de support avec tous les admins + le pro
    const supportChat = await db
      .insert(chats)
      .values({
        title: `Support - ${proFirstName} ${proLastName}`,
        participants: [...adminIds, proUserId],
        isSupport: true,
        supportUserId: proUserId,
        lastUpdated: new Date(),
      })
      .returning();

    console.log(`✅ Chat de support créé pour ${proFirstName} ${proLastName} avec ${adminIds.length} admins`);
    return supportChat[0];
  } catch (error) {
    console.error("❌ Erreur lors de la création du chat de support:", error);
    throw error;
  }
}

/**
 * Ajoute un nouvel admin à tous les chats de support existants
 */
export async function addAdminToSupportChats(adminUserId: string) {
  try {
    // Récupérer tous les chats de support
    const supportChats = await db
      .select()
      .from(chats)
      .where(eq(chats.isSupport, true));

    // Ajouter l'admin à chaque chat de support
    for (const chat of supportChats) {
      if (!chat.participants.includes(adminUserId)) {
        const updatedParticipants = [...chat.participants, adminUserId];
        
        await db
          .update(chats)
          .set({ 
            participants: updatedParticipants,
            lastUpdated: new Date()
          })
          .where(eq(chats.id, chat.id));
      }
    }

    console.log(`✅ Admin ${adminUserId} ajouté à ${supportChats.length} chats de support`);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de l'admin aux chats de support:", error);
    throw error;
  }
}