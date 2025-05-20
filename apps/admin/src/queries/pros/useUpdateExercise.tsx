import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
export const useUpdateExercise = (
  options?: ApiMutationOptions<
    (typeof client.api.admins.exercises)[":id"]["$patch"]
  >
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.admins.exercises[":id"].$patch(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
