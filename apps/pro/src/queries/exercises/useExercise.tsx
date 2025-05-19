import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "@/lib/apiClient";

export const useExercise = (exerciseId: string) => {
  return useQuery({
    queryKey: queryKeys.exercise(exerciseId),
    queryFn: async () => {
      const response = await client.api.exercises[":id"]["$get"]({
        param: { id: exerciseId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch exercise");
      }
      return response.json();
    },
  });
};
