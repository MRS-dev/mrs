import { ApiMutationOptions } from "@/lib/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { client } from "../../../lib/apiClient";

export const useCreateExercise = (
  options?: ApiMutationOptions<(typeof client.api.admins.exercises)["$post"]>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.admins.exercises.$post(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.exercises(),
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
