import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

interface MarkAsReadData {
  notificationIds?: string[];
  markAllAsRead?: boolean;
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MarkAsReadData) => {
      const response = await client.api.notifications["mark-as-read"].$patch({
        json: data,
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: () => {
      // Invalider les caches pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notificationUnreadCount(),
      });
    },
  });
};