import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";

export const useUpdateWorkoutTemplate = (
  options?: ApiMutationOptions<
    (typeof client.api)["workout-templates"][":id"]["$put"]
  >
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api["workout-templates"][":id"].$put(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
