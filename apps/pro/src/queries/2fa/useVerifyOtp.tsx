import { authClient } from "@/lib/authClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";

export const useVerifyOtp = (props: { onSuccess: () => void } | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(props || {}),
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
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      props?.onSuccess?.();
    },
  });
};
