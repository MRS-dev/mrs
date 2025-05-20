"use client";
import { ROUTES } from "@/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger directement vers la page home
    router.push(ROUTES.home);
  }, [router]); // Dépendance vide car on veut rediriger une seule fois au montage

  return <div>...loading</div>;
}
