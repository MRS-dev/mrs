import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";

export const useActivities = () => {
  return useInfiniteQuery({
    queryKey: queryKeys.activities(),
    queryFn: async ({ pageParam }) => {
      const response = await client.api.admins.activities.$get({
        query: {
          page: pageParam?.toString() || "1",
          limit: "10",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pageInfo.hasNextPage ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
