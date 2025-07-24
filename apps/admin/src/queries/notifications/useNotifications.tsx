import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications(),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.api.notifications.$get({
        query: {
          page: pageParam.toString(),
          limit: "20",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pageInfo.hasNextPage ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};