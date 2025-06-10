import { authClient } from "@/lib/authClient";
import { useMutation } from "@tanstack/react-query";

export const useSignIn = (props?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        const response = await authClient.signIn.email(data);
        await authClient.twoFactor.sendOtp();
        if (response.error) {
          throw new Error("Error while login");
        }
      } catch (err) {
        throw err;
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: () => {
      props?.onSuccess?.();
    },
  });
};
