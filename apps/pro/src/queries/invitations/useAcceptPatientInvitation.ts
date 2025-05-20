import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";

export const useAcceptPatientInvitation = (
  options?: ApiMutationOptions<
    typeof client.api.invitations.patient.accept.$post
  >
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.invitations.patient.accept.$post(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
