import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";

export const usePro = (id: string) => {
  return useQuery({
    queryKey: queryKeys.pro(id),
    queryFn: async () => {
      // const response = await client.api.admins.pros[":id"].$get({
      //   param: { id },
      // });
      // if (!response.ok) {
      //   throw new Error("Failed to fetch patients");
      // }
      return {
        todo: "todo",
      };
    },
  });
};
