import { useMutation } from "@tanstack/react-query";
import { authClient } from "../../lib/authClient";

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      name: string;
      password: string;
    }) => {
      const response = await authClient.admin.createUser({
        email: data.email,
        name: data.name,
        role: "admin",
        password: data.password,
      });
      return response;
    },
  });
};
