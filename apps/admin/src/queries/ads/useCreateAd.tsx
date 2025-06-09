import { ApiMutationOptions } from "@/lib/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";

export const useCreateAd = (
  options?: ApiMutationOptions<(typeof client.api.admins.ads)["$post"]>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.admins.ads.$post(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ads(),
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
