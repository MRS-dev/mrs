import { client } from "@/lib/apiClient";
import { ApiMutationOptions } from "@/lib/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";

export const useUpdateAdmin = (
  options?: ApiMutationOptions<typeof client.api.musics.$post>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options || {}),
    mutationFn: async (data) => {
      const res = await client.api.musics.$post(data);
      if (!res.ok) {
        throw new Error("An error occurred");
      }
      return res.json();
    },
    onSuccess: (...params) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.musics });
      options?.onSuccess?.(...params);
    },
  });
};
