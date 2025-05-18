import { authClient } from "@/lib/authClient";
import { useMutation } from "@tanstack/react-query";

export const useVerifyOtp = (props: { onSuccess: () => void } | undefined) => {
  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      await authClient.twoFactor.verifyOtp(
        { code },
        {
          onSuccess() {
            props?.onSuccess?.();
          },
          onError(ctx) {
            alert(ctx.error.message);
          },
        }
      );
    },
    ...(props || {}),
  });
};
