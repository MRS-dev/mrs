export const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const secondsElapsed = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsElapsed < 60) {
    return `Il y a ${secondsElapsed} sec${secondsElapsed > 1 ? "s" : ""}`;
  }

  const minutesElapsed = Math.floor(secondsElapsed / 60);
  if (minutesElapsed < 60) {
    return `Il y a ${minutesElapsed} min${minutesElapsed > 1 ? "s" : ""}`;
  }

  const hoursElapsed = Math.floor(minutesElapsed / 60);
  if (hoursElapsed < 24) {
    return `Il y a ${hoursElapsed} h${hoursElapsed > 1 ? "s" : ""}`;
  }

  const daysElapsed = Math.floor(hoursElapsed / 24);
  if (daysElapsed < 7) {
    return `Il y a ${daysElapsed} jour${daysElapsed > 1 ? "s" : ""}`;
  }

  const weeksElapsed = Math.floor(daysElapsed / 7);
  if (weeksElapsed < 4) {
    return `Il y a ${weeksElapsed} semaine${weeksElapsed > 1 ? "s" : ""}`;
  }

  const monthsElapsed = Math.floor(daysElapsed / 30);
  if (monthsElapsed < 12) {
    return `Il y a ${monthsElapsed} mois`;
  }

  const yearsElapsed = Math.floor(daysElapsed / 365);
  return `Il y a ${yearsElapsed} an${yearsElapsed > 1 ? "s" : ""}`;
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}min ${remainingSeconds}s`
      : `${minutes}min`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  }
};
