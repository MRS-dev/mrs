import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseId: string) => {
      const response = await client.api.admins.exercises[":id"].$delete({
        param: { id: exerciseId },
      });
      if (!response.ok) throw new Error("Failed to delete exercise");
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
