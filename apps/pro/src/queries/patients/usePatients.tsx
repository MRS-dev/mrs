import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

export const usePatients = (params?: { search?: string }) => {
  const search = params?.search || "";
  return useInfiniteQuery({
    queryKey: queryKeys.patients({ search }),
    queryFn: async () => {
      const response = await client.api.patients.$get({
        query: {
          page: "1",
          limit: "10",
          search,
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
