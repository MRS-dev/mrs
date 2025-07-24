import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "@/lib/apiClient";

interface PageInfo {
  hasNextPage?: boolean;
}

interface PageData {
  pageInfo?: PageInfo;
}

export const usePatients = (params?: { search?: string }) => {
  const search = params?.search || "";
  return useInfiniteQuery({
    queryKey: queryKeys.patients({ search }),
    queryFn: async ({ pageParam = 1 }) => {
      console.log("Fetching patients with search:", search);
      const response = await client.api.patients.$get({
        query: {
          page: pageParam.toString(),
          limit: "10",
          ...(search && { search }),
        },
      });
      if (!response.ok) throw new Error("Failed to fetch patients");
      return response.json();
    },
    getNextPageParam: (lastPage: PageData, pages: PageData[]) => {
      return lastPage?.pageInfo?.hasNextPage ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
