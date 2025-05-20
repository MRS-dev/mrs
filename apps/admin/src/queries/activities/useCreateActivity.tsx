import { ApiMutationOptions } from "@/lib/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";

export const useCreateActivity = (
  options?: ApiMutationOptions<(typeof client.api.admins.activities)["$post"]>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.admins.activities.$post(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities(),
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
