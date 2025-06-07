import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";
import type { Chat } from "@mrs/socket-client";
// ou le path où tu l’as défini

export const useChats = () => {
  return useQuery<Chat[], Error>({
    queryKey: queryKeys.chats(),
    queryFn: async (): Promise<Chat[]> => {
      const response = await client.api.chats.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      // TS comprend maintenant que c’est un Chat[]
      return response.json();
    },
  });
};
