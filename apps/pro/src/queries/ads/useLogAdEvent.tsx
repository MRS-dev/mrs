import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";

export const useLogAdEvent = () =>
  useMutation({
    mutationFn: async ({
      adId,
      type,
    }: {
      adId: string;
      type: "view" | "click";
    }) => {
      const response = await client.api.adEvents.log.$post({
        json: { adId, type },
      });
      if (!response.ok) throw new Error("Failed to log ad event");
      return response.json();
    },
  });
