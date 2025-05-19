import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useWorkoutSession = (workoutSessionId: string) => {
  return useQuery({
    queryKey: queryKeys.workoutSession(workoutSessionId),
    enabled: !!workoutSessionId,
    queryFn: async () => {
      const response = await client.api["workout-sessions"][":id"].$get({
        param: {
          id: workoutSessionId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return response.json();
    },
  });
};
