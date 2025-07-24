import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

interface CreateNotificationData {
  userId?: string;
  role?: "admin" | "pro" | "user";
  type: string;
  title: string;
  content: string;
}

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNotificationData) => {
      const response = await client.api.notifications.$post({
        json: data,
      });
      if (!response.ok) throw new Error("Failed to create notification");
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