"use client";

import React, { Suspense } from "react";
import InvitationPage from "./InvitationPage";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvitationPage />
    </Suspense>
  );
}
