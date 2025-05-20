"use client";
import { useUser } from "@/queries/user/useUser";
import { ROUTES } from "@/routes";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userQuery = useUser();
  useEffect(() => {
    if (userQuery.data?.data?.user) {
      redirect(ROUTES.home);
    }
  }, [userQuery.data]);
  return children;
}
