import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useEnabledAd = () => {
  return useQuery({
    queryKey: queryKeys.enabledAd(),
    queryFn: async () => {
      const response = await client.api.ads.enabled.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch enabled ad");
      }
      return response.json();
    },
  });
};
