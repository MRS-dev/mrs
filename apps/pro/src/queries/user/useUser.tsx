import { authClient } from "@/lib/authClient";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";

export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => authClient.getSession(),
  });
};
