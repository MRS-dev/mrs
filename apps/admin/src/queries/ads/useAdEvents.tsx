import { useQuery } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

// Type pour une stat groupée par jour et type d'event
export interface AdEventStat {
  id: string;
  adId: string;
  type: string;
  createdAt: string;
}

// Option : filtres de dates
interface AdEventStatsParams {
  adId: string;
  from?: string; // "YYYY-MM-DD"
  to?: string; // "YYYY-MM-DD"
}

export const useAdEventsStats = ({ adId, from, to }: AdEventStatsParams) =>
  useQuery<AdEventStat[]>({
    queryKey: queryKeys.adEventsStats(adId, from, to),
    queryFn: async () => {
      const response = await client.api.admins.adEvents[":adId"].$get({
        param: { adId },
        query: { from, to },
      });

      if (!response.ok) throw new Error("Failed to fetch ad event stats");
      const data = await response.json();
      // Si l'API renvoie { data: [...] }
      return data.data;
    },
    enabled: !!adId,
    staleTime: 1000 * 60 * 5,
  });
