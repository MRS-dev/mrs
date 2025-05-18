import { authClient } from "@/lib/authClient";
import { useMutation } from "@tanstack/react-query";

export const useSignOut = (props?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await authClient.signOut();
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
