import { authClient } from "@/lib/authClient";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        const response = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: "John",
          lastName: "Doe",
        });
        if (response.error) {
          throw new Error("Error while signup");
        }
      } catch (err) {
        throw err;
      }
    },
  });
};
