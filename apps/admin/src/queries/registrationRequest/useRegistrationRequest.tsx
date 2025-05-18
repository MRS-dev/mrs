import { useQuery } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useRegistrationRequest = (id: string) => {
  return useQuery({
    queryKey: queryKeys.registrationRequest(id),
    queryFn: async () => {
      const res = await client.api["registration-requests"][":id"].$get({
        param: { id },
      });
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
