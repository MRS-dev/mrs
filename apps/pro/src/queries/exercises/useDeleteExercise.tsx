import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

interface DeleteExerciseOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDeleteExercise = (options?: DeleteExerciseOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { param: { id: string } }) => {
      const res = await client.api.exercises[":id"].$delete(data);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = typeof errorData === 'object' && errorData !== null && 'error' in errorData 
          ? String(errorData.error) 
          : "Failed to delete exercise";
        throw new Error(errorMessage);
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalider le cache des exercices pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: queryKeys.exercises(),
      });
      
      // Appeler le callback de succès si fourni
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error deleting exercise:", error);
      
      // Appeler le callback d'erreur si fourni
      if (options?.onError) {
        options.onError(error as Error);
      }
    },
  });
};
