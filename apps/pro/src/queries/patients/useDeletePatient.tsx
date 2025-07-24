import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

interface DeletePatientOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDeletePatient = (options?: DeletePatientOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientId: string) => {
      const response = await client.api.patients[":patientId"].$delete({
        param: { patientId },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' && errorData !== null && 'error' in errorData 
          ? String(errorData.error) 
          : "Failed to delete patient";
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalider le cache des patients pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients(),
      });
      
      // Appeler le callback de succès si fourni
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error deleting patient:", error);
      
      // Appeler le callback d'erreur si fourni
      if (options?.onError) {
        options.onError(error as Error);
      }
    },
  });
};