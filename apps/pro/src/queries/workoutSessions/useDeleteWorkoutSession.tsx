import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";

export const useDeleteWorkoutSession = (
  options?: ApiMutationOptions<
    (typeof client.api)["workout-sessions"][":id"]["$delete"]
  >
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (variables: { param: { id: string } }) => {
      const res =
        await client.api["workout-sessions"][":id"]["$delete"](variables);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
