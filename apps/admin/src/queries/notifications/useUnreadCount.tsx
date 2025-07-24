import { useQuery } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useUnreadCount = () => {
  return useQuery({
    queryKey: queryKeys.notificationUnreadCount(),
    queryFn: async () => {
      const response = await client.api.notifications["unread-count"].$get();
      if (!response.ok) throw new Error("Failed to fetch unread count");
      return response.json();
    },
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });
};