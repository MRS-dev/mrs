import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useWorkoutTemplate = (workoutTemplateId: string) => {
  return useQuery({
    queryKey: queryKeys.workoutTemplate(workoutTemplateId),
    queryFn: async () => {
      const response = await client.api["workout-templates"][":id"]["$get"]({
        param: {
          id: workoutTemplateId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch workout templates");
      }
      const data = await response.json();
      return data || {};
    },
    enabled: !!workoutTemplateId,
  });
};
