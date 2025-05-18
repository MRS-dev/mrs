"use client";

import React from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { ROUTES } from "@/routes";
import { format } from "date-fns";
import { MrsAvatar } from "@/components/mrs/MrsAvatar";
import { usePatients } from "@/queries/patients/usePatients";
import Link from "next/link";
import { MrsQuery } from "@/components/mrs/MrsQuery";
import { cn } from "@/lib/utils";

const Patients: React.FC = () => {
  const patientsQuery = usePatients();
  const patients = patientsQuery.data?.items;
  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">
                Patients{" "}
                <span className="text-muted-foreground font-medium text-2xl">
                  ({patients?.length}/{patientsQuery.data?.pageInfo?.totalCount}
                  )
                </span>
              </h1>
              <div className="flex flex-row items-center space-x-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Rechercher"
                    className="pl-10"
                  />
                  <div className="absolute left-0 top-0 justify-center items-center flex h-full w-10 pointer-events-none">
                    <Search className="w-4 h-4 text-muted-foreground " />
                  </div>
                </div>
                <Button asChild>
                  <Link href={ROUTES.newPatient}>
                    <Plus /> Nouveau patient
                  </Link>
                </Button>
              </div>
            </div>
          </SidebarLayoutHeader>
        }
      >
        <div className="flex flex-1 flex-col gap-4 p-4 text-foreground">
          <MrsQuery
            query={patientsQuery}
            Data={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients?.map((patient) => (
                  <Link
                    key={patient.id}
                    href={ROUTES.patientOverview(patient.id)}
                    className={cn(
                      "col-span-1 bg-background rounded-xl border shadow-sm p-4 flex flex-col items-start gap-2 hover:shadow-md cursor-pointer h-full"
                    )}
                  >
                    <div className="flex flex-row items-center gap-2 w-full">
                      <MrsAvatar
                        className="size-12"
                        displayName={`${patient?.firstName} ${patient?.lastName}`}
                        src={""}
                        alt={`${patient?.firstName} ${patient?.lastName}`}
                        size={48}
                      />
                      <div className="flex flex-col flex-1 space-y-1 overflow-hidden">
                        <div className="flex flex-row items-center justify-between w-full">
                          <div className="flex flex-row items-center gap-2">
                            <h3 className="text-base font-semibold line-clamp-1">
                              {patient?.firstName} {patient?.lastName}
                            </h3>
                          </div>

                          <ChevronRight className="size-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-row items-center gap-1 w-full">
                          {
                            <p className="text-sm text-muted-foreground line-clamp-1 w-full">
                              {!!patient?.birthDate &&
                                format(
                                  new Date(patient?.birthDate),
                                  "dd/MM/yyyy"
                                )}
                            </p>
                          }
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            }
          />
        </div>
      </SidebarLayout>
    </>
  );
};
export default Patients;
