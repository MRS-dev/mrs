"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";
import { useSendOtp } from "@/queries/2fma/useEnable2fa";

const MfaSetupPage: React.FC = () => {
  const router = useRouter();

  const sendOtpMutation = useSendOtp({
    onSuccess: () => {
      router.push(ROUTES.mfaVerify);
    },
  });

  return (
    <div className="flex w-full flex-col items-center">
      <div className="h-60 max-h-[25vh] bg-primary/20 w-full"></div>
      <div className="w-full max-w-lg rounded-xl border p-10 shadow-sm relative z-10 bg-background -mt-20">
        <h1 className="text-4xl font-extrabold mb-4">Configuration 2FA</h1>
        <p className="text-muted-foreground mb-6">
          L&apos;authentification à deux facteurs (2FA) est{" "}
          <strong>obligatoire</strong> pour sécuriser votre compte. Pour
          l&apos;activer, suivez ces étapes :
        </p>
        <ol className="list-decimal list-inside mb-6 text-muted-foreground">
          <li className="mb-2">
            Cliquez sur le bouton &quot;Demande un code&quot; ci-dessous pour
            recevoir un code de vérification
          </li>
          <li className="mb-2">
            Scannez le QR code qui apparaîtra avec votre application
            d&apos;authentification
          </li>
          <li>
            Entrez le code généré par votre application pour finaliser
            l&apos;activation
          </li>
        </ol>

        <div className="flex justify-center mb-6">
          {/* <QRCode value={qrCodeUrl} /> */}
        </div>
        <Button onClick={() => sendOtpMutation.mutate()}>
          {sendOtpMutation.isPending ? "Envoi en cours..." : "Demande un code"}
        </Button>
      </div>
    </div>
  );
};

export default MfaSetupPage;
