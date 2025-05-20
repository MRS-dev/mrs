import { ApiMutationOptions } from "@/lib/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useCreateExercise = (
  options?: ApiMutationOptions<typeof client.api.exercises.$post>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.exercises.$post(data);
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
