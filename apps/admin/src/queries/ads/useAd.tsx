import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";

export const useAd = (adId: string) => {
  return useQuery({
    queryKey: queryKeys.ad(adId),
    queryFn: async () => {
      console.log("JE PASSE ICI");
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

export const useToggleAdEnabled = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, enable }: { id: string; enable: boolean }) => {
      const response = await client.api.admins.ads[":id"].$patch({
        param: { id },
        json: { enable },
      });
      if (!response.ok) throw new Error("Failed to update ad status");
      return response.json();
    },
    onSuccess: () => {
      // Invalide toutes les queries de pub pour refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.ads() });
      // Tu peux aussi faire un toast ou feedback ici si besoin
    },
  });
};
