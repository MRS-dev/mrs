"use client";

import React, { useState } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Search, Info, Calendar, Phone, Mail, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { ROUTES } from "@/routes";
import { format } from "date-fns";
import { MrsAvatar } from "@/components/mrs/MrsAvatar";
import { usePatients } from "@/queries/patients/usePatients";
import Link from "next/link";
import { cn } from "@/lib/utils";
import GridLayout from "@/components/mrs/GridLayout";
import PatientInfoModal from "@/components/modals/PatientInfoModal";
import DeletePatientModal from "@/components/modals/DeletePatientModal";

interface PageData {
  items: Patient[];
  pageInfo: {
    totalCount: number;
  };
}

interface PatientsData {
  pages: PageData[];
}

// Type pour Patient (devrait idéalement venir d'un fichier types partagé)
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phoneNumber?: string;
  socialSecurityNumber: string;
  address?: {
    street: string;
    complement?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  emergencyContact?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    phoneNumber2?: string;
    email?: string;
  };
  allergies?: string;
  status?: "created" | "invited" | "active" | "inactive";
}

const ITEMS_PER_PAGE = 10;
const Patients: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const patientsQuery = usePatients();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = patientsQuery;
  const patients = (data as unknown as PatientsData)?.pages?.flatMap((page: PageData) => page.items) || [];
  
  // Debug: console log pour voir la structure des données patients
  console.log("Patients data:", patients.length > 0 ? patients[0] : "No patients");

  const handlePatientClick = (e: React.MouseEvent, patient: Patient) => {
    console.log("Patient clicked:", patient);
    e.preventDefault();
    e.stopPropagation();
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, patient: Patient) => {
    e.preventDefault();
    e.stopPropagation();
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPatientToDelete(null);
  };
  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">
                Patients{" "}
                <span className="text-muted-foreground font-medium text-2xl">
                  ({patients?.length}/
                  {(patientsQuery.data as unknown as PatientsData)?.pages[0]?.pageInfo?.totalCount})
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
        <div className="flex flex-1 flex-col gap-4 text-foreground  p-6 xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm mx-auto w-full">
          <GridLayout
            items={patients}
            renderGridItem={(patient) => (
              <div
                key={patient.id}
                className={cn(
                  "col-span-1 bg-background rounded-xl border shadow-sm hover:shadow-md h-full relative group"
                )}
              >
                <Link
                  href={ROUTES.patient(patient.id)}
                  className="p-4 flex flex-col items-start gap-2 cursor-pointer h-full min-h-[140px]"
                >
                  <div className="flex flex-row items-center gap-2 w-full">
                    <MrsAvatar
                      className="size-12"
                      displayName={`${patient?.firstName} ${patient?.lastName}`}
                      src={""}
                      alt={`${patient?.firstName} ${patient?.lastName}`}
                      size={48}
                    />
                    <div className="flex flex-col flex-1 space-y-2 overflow-hidden">
                      <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-base font-semibold line-clamp-1">
                            {patient?.firstName} {patient?.lastName}
                          </h3>
                          {patient?.status && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs w-fit ${
                                patient.status === 'active' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : patient.status === 'inactive'
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : patient.status === 'invited'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-gray-100 text-gray-800 border-gray-200'
                              }`}
                            >
                              {patient.status === 'active' ? 'Actif' : 
                               patient.status === 'inactive' ? 'Inactif' :
                               patient.status === 'invited' ? 'Invité' : 
                               patient.status === 'created' ? 'Créé' : 'Inconnu'}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handlePatientClick(e, patient)}
                          >
                            <Info className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => handleDeleteClick(e, patient)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full">
                        {!!patient?.birthDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="size-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(patient.birthDate), "dd/MM/yyyy")} 
                              ({new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} ans)
                            </p>
                          </div>
                        )}
                        {!!patient?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="size-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {patient.email}
                            </p>
                          </div>
                        )}
                        {!!patient?.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="size-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {patient.phoneNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            keyExtractor={(patient) => patient?.id.toString()}
            isLoading={isLoading}
            error={error?.message}
            hasMore={hasNextPage}
            emptyMessage="Aucun patient trouvé"
            isLoadingMore={isFetchingNextPage}
            onLoadMore={fetchNextPage}
            skeletonCount={ITEMS_PER_PAGE}
          />
        </div>
      </SidebarLayout>
      
      <PatientInfoModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      
      <DeletePatientModal
        patient={patientToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
      />
    </>
  );
};
export default Patients;
