import { authClient } from "@/lib/authClient";

export const useUser = () => {
  return authClient.useSession();
};
