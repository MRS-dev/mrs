import { authClient } from "@/lib/authClient";
import { ROUTES } from "@/routes";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useSignIn = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        const response = await authClient.signIn.email(data, {
          async onSuccess(context) {
            if (context.data.twoFactorRedirect) {
              await authClient.twoFactor.sendOtp();
              router.push(ROUTES.mfaVerify);
            } else {
              router.push(ROUTES.mfaSetup);
            }
          },
        });
        if (response.error) {
          throw new Error("Error while login");
        }
        return response;
      } catch (err) {
        throw err;
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });
};
