import { useQuery } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

export const usePatient = (patientId: string) => {
  return useQuery({
    queryKey: queryKeys.patient(patientId),
    queryFn: async () => {
      const response = await client.api.patients[":patientId"]["$get"]({
        param: {
          patientId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch patient");
      }
      return response.json();
    },
  });
};
