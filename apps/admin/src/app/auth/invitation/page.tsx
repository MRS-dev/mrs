"use client";
import React, { Suspense } from "react";
import PageInvitation from "./PageInvitation";

const InvitationPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageInvitation />
    </Suspense>
  );
};

export default InvitationPage;
