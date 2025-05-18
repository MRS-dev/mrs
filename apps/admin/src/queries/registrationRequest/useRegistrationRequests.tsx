import { useQuery } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useRegistrationRequests = () => {
  return useQuery({
    queryKey: queryKeys.registrationRequests(),
    queryFn: async () => {
      const res = await client.api["registration-requests"].$get();
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
