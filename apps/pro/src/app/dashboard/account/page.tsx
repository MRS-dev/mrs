"use client";
import React from "react";
import AccountInformationForm from "./components/AccountInformationsForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccountInformations: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <Accordion type="single" collapsible className="w-full border rounded-xl">
        <AccordionItem value="default">
          <AccordionTrigger className="p-4">
            <h3 className="text-xl font-semibold">Informations personnelles</h3>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <AccountInformationForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="email">
          <AccordionTrigger className="p-4">
            <h3 className="text-xl font-semibold">Modifier mon adresse mail</h3>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <ChangePasswordForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="password">
          <AccordionTrigger className="p-4">
            <h3 className="text-xl font-semibold">Modifier mon mot de passe</h3>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <ChangePasswordForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccountInformations;
