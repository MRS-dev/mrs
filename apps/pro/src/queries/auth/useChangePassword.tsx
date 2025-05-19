import { authClient } from "@/lib/authClient";
import { useMutation } from "@tanstack/react-query";

export const useChangePassword = (props?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      try {
        const response = await authClient.changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
        if (response.error) {
          throw new Error("Error while login");
        }
      } catch (err) {
        throw err;
      }
    },
    onSuccess: () => {
      props?.onSuccess?.();
    },
  });
};
