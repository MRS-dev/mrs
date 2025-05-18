import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";

export const useDeleteExercise = (
  options?: ApiMutationOptions<(typeof client.api.exercises)[":id"]["$delete"]>
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.exercises[":id"].$delete(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
