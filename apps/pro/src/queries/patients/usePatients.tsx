import { useQuery } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

export const usePatients = () => {
  return useQuery({
    queryKey: queryKeys.patients,
    queryFn: async () => {
      const response = await client.api.patients.$get({
        query: {
          page: "1",
          limit: "10",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      return response.json();
    },
  });
};
