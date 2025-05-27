import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";

export const usePro = (id: string) => {
  return useQuery({
    queryKey: queryKeys.pro(id),
    queryFn: async () => {
      const response = await client.api.admins.pros[":id"].$get({
        param: {
          id,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return response.json();
    },
  });
};
