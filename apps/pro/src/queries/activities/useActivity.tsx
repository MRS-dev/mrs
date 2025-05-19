import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useActivity = (activityId: string) => {
  return useQuery({
    queryKey: queryKeys.activity(activityId),
    queryFn: async () => {
      const response = await client.api.activities[":id"]["$get"]({
        param: { id: activityId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }
      return response.json();
    },
  });
};
