import { client } from "../../../lib/apiClient";
import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";

export const useAcceptRegistrationRequest = (
  options?: ApiMutationOptions<
    (typeof client.api)["registration-requests"]["accept"]["$put"]
  >
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res =
        await client.api["registration-requests"]["accept"]["$put"](data);
      if (!res.ok) {
        throw new Error("Failed to accept registration request");
      }
      return res.json();
    },
  });
};
