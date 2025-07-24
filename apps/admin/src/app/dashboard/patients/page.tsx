"use client";
import React, { useMemo, useState } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Search, Info, Calendar, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { usePatients } from "@/queries/patients";
import GridLayout from "@/components/mrs/GridLayout";
import PatientInfoModal from "@/components/modals/PatientInfoModal";

interface Address {
  street: string;
  complement?: string;
  city: string;
  postalCode: string;
  country: string;
}

interface EmergencyContact {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phoneNumber2?: string;
  email?: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phoneNumber?: string | null;
  socialSecurityNumber: string;
  address?: Address | null;
  emergencyContact?: EmergencyContact | null;
  allergies?: string | null;
  status?: "created" | "invited" | "active" | "inactive" | null;
}

const Patients: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  // const filter = { search };
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePatients();

  const allPatients = useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data]
  );

  const handlePatientClick = (e: React.MouseEvent, patient: Patient) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "invited":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "created":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "inactive":
        return "Inactif";
      case "invited":
        return "Invité";
      case "created":
        return "Créé";
      default:
        return "Inconnu";
    }
  };
  return (
    <>
    <SidebarLayout
      Header={
        <SidebarLayoutHeader
        // Footer={
        //   <div className="flex flex-row px-4 py-2 border-t space-x-2">
        //     <DoctorBadge
        //       className="cursor-pointer"
        //       selected={status.includes("VERIFIED")}
        //       onSelect={() =>
        //         setStatus((prev) =>
        //           prev.includes("VERIFIED")
        //             ? prev.filter((status) => status !== "VERIFIED")
        //             : [...prev, "VERIFIED"]
        //         )
        //       }
        //       status="VERIFIED"
        //     />
        //     <DoctorBadge
        //       className="cursor-pointer"
        //       selected={status.includes("AWAITING_VERIFICATIONS")}
        //       onSelect={() =>
        //         setStatus((prev) =>
        //           prev.includes("AWAITING_VERIFICATIONS")
        //             ? prev.filter(
        //                 (status) => status !== "AWAITING_VERIFICATIONS"
        //               )
        //             : [...prev, "AWAITING_VERIFICATIONS"]
        //         )
        //       }
        //       status="AWAITING_VERIFICATIONS"
        //     />
        //     <DoctorBadge
        //       className="cursor-pointer"
        //       selected={status.includes("VERIFICATION_IN_PROGRESS")}
        //       onSelect={() =>
        //         setStatus((prev) =>
        //           prev.includes("VERIFICATION_IN_PROGRESS")
        //             ? prev.filter(
        //                 (status) => status !== "VERIFICATION_IN_PROGRESS"
        //               )
        //             : [...prev, "VERIFICATION_IN_PROGRESS"]
        //         )
        //       }
        //       status="VERIFICATION_IN_PROGRESS"
        //     />
        //     <DoctorBadge
        //       className="cursor-pointer"
        //       selected={status.includes("REJECTED")}
        //       onSelect={() =>
        //         setStatus((prev) =>
        //           prev.includes("REJECTED")
        //             ? prev.filter((status) => status !== "REJECTED")
        //             : [...prev, "REJECTED"]
        //         )
        //       }
        //       status="REJECTED"
        //     />
        //     <DoctorBadge
        //       className="cursor-pointer"
        //       selected={status.includes("BANNED")}
        //       onSelect={() =>
        //         setStatus((prev) =>
        //           prev.includes("BANNED")
        //             ? prev.filter((status) => status !== "BANNED")
        //             : [...prev, "BANNED"]
        //         )
        //       }
        //       status="BANNED"
        //     />
        //   </div>
        // }
        >
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
            <h1 className="text-xl font-bold">
              Patients{" "}
              <span className="text-muted-foreground text-base">
                ({allPatients.length}/{data?.pages[0].pageInfo.totalCount})
              </span>
            </h1>
            <div className="flex flex-row items-center space-x-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Rechercher"
                  className="pl-10 bg-opacity-80"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute left-0 top-0 justify-center items-center flex h-full w-10 pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground " />
                </div>
              </div>
            </div>
          </div>
        </SidebarLayoutHeader>
      }
    >
      <div className="flex flex-1 flex-col gap-4 text-foreground  p-6 xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm mx-auto w-full">
        <GridLayout
          renderGridItem={(item) => (
            <div 
              key={item.id}
              className="bg-background rounded-xl border shadow-sm hover:shadow-md cursor-pointer relative group"
            >
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {item.firstName.charAt(0)}
                      {item.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-semibold line-clamp-1">
                        {item.firstName} {item.lastName}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handlePatientClick(e, item)}
                      >
                        <Info className="size-4" />
                      </Button>
                    </div>
                    {item.status && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs w-fit mb-2 ${getStatusColor(item.status)}`}
                      >
                        {getStatusLabel(item.status)}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {item.birthDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(item.birthDate), "dd/MM/yyyy")} 
                        ({new Date().getFullYear() - new Date(item.birthDate).getFullYear()} ans)
                      </span>
                    </div>
                  )}
                  {item.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="size-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {item.email}
                      </span>
                    </div>
                  )}
                  {item.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {item.phoneNumber}
                      </span>
                    </div>
                  )}
                  {item.socialSecurityNumber && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {item.socialSecurityNumber}
                      </span>
                    </div>
                  )}
                  {item.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {item.address.city}, {item.address.postalCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          keyExtractor={(patient) => patient?.id}
          items={allPatients}
          hasMore={hasNextPage ?? false}
          onLoadMore={fetchNextPage}
          isLoadingMore={isFetchingNextPage}
          isLoading={isLoading}
          error={error?.message}
        />
      </div>
    </SidebarLayout>
    
    <PatientInfoModal
      patient={selectedPatient}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
    />
    </>
  );
};

export default Patients;
