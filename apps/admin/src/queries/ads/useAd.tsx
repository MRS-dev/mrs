import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";

export const useAd = (adId: string) => {
  return useQuery({
    queryKey: queryKeys.ad(adId),
    queryFn: async () => {
      const response = await client.api.admins.ads[":id"]["$get"]({
        param: { id: adId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch ad");
      }
      return response.json();
    },
  });
};
