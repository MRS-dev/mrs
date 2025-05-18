"use client";
import { ROUTES } from "@/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Rediriger directement vers la page home
    router.push(ROUTES.home);
  }, []); // Dépendance vide car on veut rediriger une seule fois au montage

  return <div>{children}</div>;
}
