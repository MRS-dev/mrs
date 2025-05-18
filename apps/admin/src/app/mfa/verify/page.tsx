"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";
import { Input } from "@/components/ui/input";
import { useVerifyOtp } from "@/queries/2fma/useVerifyOtp";

const MfaVerifyPage: React.FC = () => {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");

  const verifyOtpMutation = useVerifyOtp({
    onSuccess: () => {
      router.push(ROUTES.home);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpMutation.mutate({ code: otpCode });
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="h-60 max-h-[25vh] bg-primary/20 w-full"></div>
      <div className="w-full max-w-lg rounded-xl border p-10 shadow-sm relative z-10 bg-background -mt-20">
        <h1 className="text-4xl font-extrabold mb-4">Vérification 2FA</h1>
        <p className="text-muted-foreground mb-6">
          Veuillez entrer le code de vérification généré par votre application
          d&apos;authentification.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Entrez votre code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={verifyOtpMutation.isPending || otpCode.length !== 6}
          >
            {verifyOtpMutation.isPending ? "Vérification..." : "Vérifier"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MfaVerifyPage;
