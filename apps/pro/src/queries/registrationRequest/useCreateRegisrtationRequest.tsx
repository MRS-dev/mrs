import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";

export const useCreateRegistrationRequest = (
  options?: ApiMutationOptions<
    (typeof client.api)["registration-requests"]["$put"]
  >
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api["registration-requests"]["$put"](data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
