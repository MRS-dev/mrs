"use client";
import React, { useMemo } from "react";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { Plus } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { MrsAvatar } from "@/components/mrs/MrsAvatar";
import { usePatient } from "@/queries/patients/usePatient";
import { cn } from "@/lib/utils";
const PatientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { patientId } = useParams<{ patientId: string }>();
  const patientQuery = usePatient(patientId);
  const pathname = usePathname();

  const isPatientHome = useMemo(
    () => pathname === ROUTES.patientOverview(patientId),
    [pathname, patientId]
  );
  const isPatientSessions = useMemo(
    () => pathname === ROUTES.patientWorkoutSessions(patientId),
    [pathname, patientId]
  );
  const isPatientReports = useMemo(
    () => pathname === ROUTES.patientReports(patientId),
    [pathname, patientId]
  );
  const isPatientInformations = useMemo(
    () => pathname === ROUTES.patientInformations(patientId),
    [pathname, patientId]
  );
  return (
    <SidebarLayout
      className="max-h-screen h-screen"
      Header={
        <div>
          <SidebarLayoutHeader
            Footer={
              <div className="flex flex-row items-center px-3 mx-auto max-w-4xl w-full">
                <Link
                  href={ROUTES.patientOverview(patientId)}
                  className={cn(
                    "px-3  py-2 box-border hover:bg-primary/10 rounded-t-xl border-b-4 border-transparent transition-all duration-300",
                    isPatientHome && "border-b-primary"
                  )}
                >
                  Détails
                </Link>
                <Link
                  href={ROUTES.patientWorkoutSessions(patientId)}
                  className={cn(
                    "px-3  py-2 box-border hover:bg-primary/10 rounded-t-xl border-b-4 border-transparent transition-all duration-300",
                    isPatientSessions && "border-b-primary"
                  )}
                >
                  Séances
                </Link>
                <Link
                  href={ROUTES.patientReports(patientId)}
                  className={cn(
                    "px-3  py-2 box-border hover:bg-primary/10 rounded-t-xl border-b-4 border-transparent transition-all duration-300",
                    isPatientReports && "border-b-primary"
                  )}
                >
                  Rapports
                </Link>
                <Link
                  href={ROUTES.patientInformations(patientId)}
                  className={cn(
                    "px-3  py-2 box-border hover:bg-primary/10 rounded-t-xl border-b-4 border-transparent transition-all duration-300",
                    isPatientInformations && "border-b-primary"
                  )}
                >
                  Informations
                </Link>
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
