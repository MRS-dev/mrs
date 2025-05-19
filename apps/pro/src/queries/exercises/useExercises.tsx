import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "@/lib/apiClient";

export const useExercises = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.exercises({ page, limit }),
    queryFn: async () => {
      const response = await client.api.exercises.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return response.json();
    },
  });
};
