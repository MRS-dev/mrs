"use client";
import { useQuery } from "@tanstack/react-query";
import { client } from "../../../lib/apiClient";
import { queryKeys } from "../queryKeys";

export const useAdmins = () => {
  return useQuery({
    queryKey: queryKeys.admins(),
    queryFn: async () => {
      const res = await client.api.admins.$get();
      if (!res.ok) {
        throw new Error("An error orccured");
      }
      return res.json();
    },
  });
};
