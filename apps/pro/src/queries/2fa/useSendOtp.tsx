import { useMutation } from "@tanstack/react-query";
import { authClient } from "../../lib/authClient";

export const useSendOtp = (props: { onSuccess: () => void } | undefined) => {
  return useMutation({
    ...(props || {}),
    mutationFn: async () => {
      const { data } = await authClient.twoFactor.sendOtp();
      return data;
    },
  });
};
