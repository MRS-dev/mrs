"use client";
import { useUser } from "@/queries/user/useUser";
import { ROUTES } from "@/routes";
import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useUser();
  if (user) {
    redirect(ROUTES.home);
  }
  return children;
}
