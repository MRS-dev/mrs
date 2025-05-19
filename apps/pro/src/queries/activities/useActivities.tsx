import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useActivities = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.activities({ page, limit }),
    queryFn: async () => {
      const response = await client.api.activities.$get({
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
