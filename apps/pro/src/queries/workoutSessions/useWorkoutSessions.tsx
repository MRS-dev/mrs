import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

type WorkoutSessionsFilter = {
  limit: string | string[];
  page: string | string[];
  patientId: string | string[];
  from?: string | string[] | undefined;
  to?: string | string[] | undefined;
};

export const useWorkoutSessions = (filter: WorkoutSessionsFilter) => {
  return useInfiniteQuery({
    queryKey: queryKeys.workoutSessions(filter),
    enabled: !!filter,
    queryFn: async () => {
      const response = await client.api["workout-sessions"].$get({
        query: filter,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch workout sessions");
      }
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pageInfo.hasNextPage ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
