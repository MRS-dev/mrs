import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "@/lib/apiClient";

export const useMessages = (chatId: string) => {
  return useQuery({
    queryKey: queryKeys.messages(chatId),
    enabled: !!chatId,
    queryFn: async () => {
      const response = await client.api.messages[":chatId"].$get({
        param: {
          chatId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return response.json();
    },
  });
};
