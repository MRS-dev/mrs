import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";

export const useCreateExercise = (
  options?: ApiMutationOptions<typeof client.api.exercises.$post>
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.exercises.$post(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
