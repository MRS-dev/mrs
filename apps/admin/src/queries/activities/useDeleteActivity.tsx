import { ApiMutationOptions } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";

export const useDeleteActivity = (
  options?: ApiMutationOptions<
    (typeof client.api.admins.activities)[":id"]["$delete"]
  >
) => {
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.admins.activities[":id"].$delete(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
  });
};
