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
  const router = useRouter();
  useEffect(() => {
    const currentUser = user.data?.data?.user;
    console.log("currentUser", currentUser);
    if (currentUser && !currentUser?.twoFactorEnabled) {
      router.push(ROUTES.mfaSetup);
    }
    if (!currentUser && !user.isFetching) {
      router.push(ROUTES.signIn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  if (user?.isPending) {
    return <div>Loading...</div>;
  }
  return <div>{children}</div>;
}
