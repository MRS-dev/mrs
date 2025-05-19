import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/apiClient";

export const useDeleteWorkoutSessions = (
  options?: ApiMutationOptions<
    (typeof client.api)["workout-sessions"]["$delete"]
  >
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (variables: { json: { ids: string[] } }) => {
      const res = await client.api["workout-sessions"]["$delete"](variables);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
