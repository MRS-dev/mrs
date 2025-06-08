"use client";
import { useUser } from "@/queries/user/useUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  console.log("user in layout", user);
  const router = useRouter();
  useEffect(() => {
    const currentUser = user.data?.user;
    if (currentUser && !currentUser?.twoFactorEnabled) {
      router.push(ROUTES.mfaSetup);
    }
    if (!currentUser && !user.isPending) {
      router.push(ROUTES.login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  if (user?.isPending) {
    return <div>Loading...</div>;
  }
  return <div>{children}</div>;
}
