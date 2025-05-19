import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "@/lib/apiClient";

export const useChats = () => {
  return useQuery({
    queryKey: queryKeys.chats(),
    queryFn: async () => {
      const response = await client.api.chats.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return response.json();
    },
  });
};
