import { authClient } from "@/lib/authClient";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { ROUTES } from "@/routes";
import { useRouter } from "next/navigation";

export const useSignIn = (props?: { onSuccess?: () => void }) => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        await authClient.signIn.email(data);
        const mfaStatusResponse = await client.api.user.mfa.status.$get();
        console.log("mfaStatus", mfaStatusResponse);
        if (mfaStatusResponse.status === 401) {
          throw new Error("2FA is not enabled");
        }

        const mfaStatus = await mfaStatusResponse.json();
        if (mfaStatus.is2faEnabled === null) {
          router.push(ROUTES.mfaSetup);
        } else if (mfaStatus.is2faEnabled === true) {
          await authClient.twoFactor.sendOtp();
          router.push(ROUTES.mfaVerify);
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
