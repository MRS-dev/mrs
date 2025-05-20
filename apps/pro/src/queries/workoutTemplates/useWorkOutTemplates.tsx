import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useWorkoutTemplates = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  return useInfiniteQuery({
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
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pageInfo.hasNextPage ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
