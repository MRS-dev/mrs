"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useEnable2fa } from "@/queries/2fma/useEnable2fa";
import InputPassword from "@/components/mrs/MrsInputPassword";

const MfaSetupPage: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const enable2faMutation = useEnable2fa({
    onSuccess: () => {
      router.push(ROUTES.mfaVerify);
    },
  });

  const handleSubmit = () => {
    if (password) {
      enable2faMutation.mutate({ password });
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="h-60 max-h-[25vh] bg-primary/20 w-full"></div>
      <div className="w-full max-w-lg rounded-xl border p-10 shadow-sm relative z-10 bg-background -mt-20">
        <h1 className="text-4xl font-extrabold mb-4">
          Activer l&apos;authentification à deux facteurs
        </h1>
        <p className="text-muted-foreground mb-6">
          Pour renforcer la sécurité de votre compte, veuillez entrer votre mot
          de passe actuel pour commencer la configuration de
          l&apos;authentification à deux facteurs (2FA).
        </p>

        <div className="space-y-4 mb-6">
          <InputPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe actuel"
            className="w-full"
          />
          {enable2faMutation.isError && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                {enable2faMutation.error?.message ||
                  "Une erreur est survenue. Veuillez réessayer."}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={enable2faMutation.isPending || !password}
        >
          {enable2faMutation.isPending
            ? "Vérification en cours..."
            : "Continuer et activer 2FA"}
        </Button>
      </div>
    </div>
  );
};

export default MfaSetupPage;
