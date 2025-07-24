/**
 * Formate une date en format d'heure/date relatif
 */
export function formatMessageTime(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  // Si c'est aujourd'hui, afficher l'heure
  if (diffInHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Si c'est hier
  if (diffInHours < 48 && date.getDate() === now.getDate() - 1) {
    return "Hier";
  }

  // Si c'est cette semaine
  if (diffInHours < 168) {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short'
    });
  }

  // Sinon, afficher la date
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Tronque un message à une longueur donnée
 */
export function truncateMessage(message?: string, maxLength: number = 50): string {
  if (!message) return "";
  
  if (message.length <= maxLength) {
    return message;
  }
  
  return message.substring(0, maxLength).trim() + "...";
}