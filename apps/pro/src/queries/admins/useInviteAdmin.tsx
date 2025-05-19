import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";

export const useInviteAdmin = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await client.api.admins.invite.admin.$post({
        json: { email: data.email, role: "admin" },
      });
      if (!response.ok) {
        throw new Error("Failed to invite admin");
      }
      return response;
    },
  });
};
