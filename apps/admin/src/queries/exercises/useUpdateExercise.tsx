import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

interface UpdateExerciseData {
  title?: string;
  description?: string;
  photoUrl?: string;
  videoUrl?: string;
  tags?: string[];
  public?: boolean;
}

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ exerciseId, data }: { exerciseId: string; data: UpdateExerciseData }) => {
      const response = await client.api.admins.exercises[":id"].$patch({
        param: { id: exerciseId },
        json: data,
      });
      if (!response.ok) throw new Error("Failed to update exercise");
      return response.json();
    },
    onSuccess: () => {
      // Invalider le cache des exercices pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: queryKeys.exercises(),
      });
    },
  });
};
