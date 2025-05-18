"use client";
import React from "react";

import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import SidebarLayout from "@/components/core/SidebarLayout";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MrsAvatar } from "@/components/mrs/MrsAvatar";
import { usePatient } from "@/queries/patients/usePatient";
const PatientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { patientId } = useParams<{ patientId: string }>();
  const patientQuery = usePatient(patientId);

  const birthdate = patientQuery.data?.birthDate
    ? format(patientQuery.data?.birthDate, "dd MMMM yyyy", { locale: fr })
    : "";

  const isPatientHome = location.pathname.includes(
    ROUTES.patientOverview(patientId)
  );
  const isPatientSessions =
    location.pathname === ROUTES.patientSessions(patientId);
  // const isPatientInformations =
  //   location.pathname === ROUTES.patientInformations("test");
  const isPatientReports =
    location.pathname === ROUTES.patientReports(patientId);
  const isPatientInformations =
    location.pathname === ROUTES.patientInformations(patientId);
  return (
    <SidebarLayout
      className="max-h-screen h-screen"
      Header={
        <div>
          <SidebarLayoutHeader
            Footer={
              <div className="px-6 pb-2 xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm mx-auto w-full ">
                <div className="flex flex-row gap-2">
                  <Button
                    variant={isPatientHome ? "default" : "outline"}
                    asChild
                  >
                    <Link href={ROUTES.patientOverview(patientId)}>
                      Détails
                    </Link>
                  </Button>
                  <Button
                    variant={isPatientSessions ? "default" : "outline"}
                    asChild
                  >
                    <Link href={ROUTES.patientSessions(patientId)}>
                      Séances
                    </Link>
                  </Button>
                  <Button
                    variant={isPatientReports ? "default" : "outline"}
                    asChild
                  >
                    <Link href={ROUTES.patientReports(patientId)}>
                      Rapports
                    </Link>
                  </Button>
                  <Button
                    variant={isPatientInformations ? "default" : "outline"}
                    asChild
                  >
                    <Link href={ROUTES.patientInformations(patientId)}>
                      Informations
                    </Link>
                  </Button>
                </div>
              </div>
            }
          >
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <div className="flex flex-row items-center gap-2">
                <MrsAvatar
                  displayName={`${patientQuery.data?.firstName} ${patientQuery.data?.lastName}`}
                  src={""}
                  alt={`${patientQuery.data?.firstName} ${patientQuery.data?.lastName}`}
                  size={32}
                />
                <h1 className="text-lg font-bold">
                  {patientQuery.data?.firstName} {patientQuery.data?.lastName}
                </h1>
              </div>
              <div className="flex flex-row items-center space-x-3">
                <Button variant="default" asChild>
                  <Link href={ROUTES.newSession + `?patientId=${patientId}`}>
                    <Plus /> Nouvelle séance
                  </Link>
                </Button>
              </div>
            </div>
          </SidebarLayoutHeader>
        </div>
      }
    >
      <div className="flex flex-1 flex-col  text-foreground  overflow-auto">
        <div className="flex flex-col gap-4 p-6 xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm mx-auto w-full ">
          {children}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PatientLayout;
