import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

interface CreatePatientData {
  json: {
    email: string;
    lastName: string;
    firstName: string;
    birthDate: Date;
    socialSecurityNumber: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
      complement?: string;
    };
    phoneNumber?: string;
    phoneNumber2?: string;
    allergies?: string;
    emergencyContact?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      phoneNumber2?: string;
      email?: string;
    };
  };
}

interface CreatePatientOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export const useCreatePatient = (
  options?: CreatePatientOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePatientData) => {
      console.log("Creating patient with data:", data);
      const response = await client.api.patients.$post(data);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' && errorData !== null && 'error' in errorData 
          ? String(errorData.error) 
          : "Failed to create patient";
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Invalider le cache des patients pour rafraîchir la liste
      queryClient.invalidateQueries({
        queryKey: queryKeys.patients(),
      });
      
      // Appeler le callback de succès si fourni
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Error creating patient:", error);
      
      // Appeler le callback d'erreur si fourni
      if (options?.onError) {
        options.onError(error as Error);
      }
    },
  });
};
