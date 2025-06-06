import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../../lib/authClient";
import { queryKeys } from "../queryKeys";
import { useSendOtp } from "./useSendOtp";

export const useEnable2fa = (props: { onSuccess: () => void } | undefined) => {
  const sendOtp = useSendOtp({
    onSuccess: () => {
      props?.onSuccess?.();
    },
  });
  const queryClient = useQueryClient();
  return useMutation({
    ...(props || {}),
    mutationFn: async (data: { password: string }) => {
      const { data: res } = await authClient.twoFactor.enable({
        password: data.password,
      });
      await sendOtp.mutateAsync();
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user() });
      props?.onSuccess?.();
    },
  });
};
