import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useWorkoutTemplates = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.workoutTemplates({ page, limit }),
    queryFn: async () => {
      const response = await client.api["workout-templates"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch workout templates");
      }
      return response.json();
    },
  });
};
