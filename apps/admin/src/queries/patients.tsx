import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { client } from "../../lib/apiClient";

export const usePatients = (params?: { search?: string }) => {
  const search = params?.search || "";
  return useInfiniteQuery({
    queryKey: queryKeys.patients({ search }),
    queryFn: async () => {
      const response = await client.api.admins.patients.$get({
        query: {
          page: "1",
          limit: "30",
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
