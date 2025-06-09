import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";

export const useAds = () => {
  return useInfiniteQuery({
    queryKey: queryKeys.ads(),
    queryFn: async ({ pageParam = 1 }) => {
      // on ouvre un bloc pour pouvoir déclarer des const
      const response = await client.api.admins.ads.$get({
        query: {
          page: pageParam.toString(),
          limit: "30",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ads");
      }

      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pageInfo.hasNextPage ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
