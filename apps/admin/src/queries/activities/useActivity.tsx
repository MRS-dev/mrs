import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";

export const useActivity = (activityId: string) => {
  return useQuery({
    queryKey: queryKeys.activity(activityId),
    queryFn: async () => {
      const response = await client.api.admins.activities[":id"]["$get"]({
        param: { id: activityId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }
      return response.json();
    },
  });
};
