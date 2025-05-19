// components/PatientPicker.tsx
"use client";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { PickerModal } from "./PickerModal";
import { usePatients } from "@/queries/patients/usePatients";
import { usePatient } from "@/queries/patients/usePatient";
import { MrsAvatar } from "../mrs/MrsAvatar";

interface PatientPickerProps {
  value: string; // L'ID du patient sélectionné
  onChange: (value: string) => void;
  className?: string;
}

export default function PatientPicker({
  value,
  onChange,
  className,
}: PatientPickerProps) {
  // Recherche dans le modal
  const [search, setSearch] = useState("");
  // const debouncedSearch = useDebounce(search, 500);

  const patientsQuery = usePatients();
  const patientQuery = usePatient(value);
  console.log("patientQuery", patientQuery);
  return (
    <PickerModal
      className={className}
      value={value}
      valueExtractor={(item) => item.id}
      renderValue={() => {
        return (
          patientQuery?.data?.firstName + " " + patientQuery?.data?.lastName
        );
      }}
      onSelect={onChange}
      title="Patients"
      placeholder="Sélectionner un patient"
      renderItem={(item) => {
        const isValue = value === item.id;
        return (
          <div
            className={cn(
              "rounded-xl border p-4 bg-background",
              isValue && "border-primary"
            )}
          >
            <div className="flex flex-row items-start gap-2">
              <div className="size-10 rounded-full bg-muted">
                <MrsAvatar
                  src={""}
                  size={40}
                  alt={item.firstName}
                  className="w-10 h-10  rounded-full"
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex flex-row justify-between items-center">
                  <p>
                    {item.firstName} {item.lastName}
                  </p>
                  {isValue && (
                    <div className="rounded-full p-1 bg-primary">
                      <Check className="size-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {format(new Date(item.birthDate), "dd/MM/yyyy")}
                </p>
                <p className="text-muted-foreground text-sm">
                  {item.birthDate}
                </p>
              </div>
            </div>
          </div>
        );
      }}
      // Extracteurs
      keyExtractor={(item) => item.id}
      search={search}
      onSearch={setSearch}
      items={patientsQuery.data?.items || []}
      resultsCount={patientsQuery.data?.pageInfo?.totalCount}
      totalCount={patientsQuery.data?.pageInfo?.totalCount}
      isLoading={patientsQuery.isLoading}
      hasMore={!!patientsQuery.data?.pageInfo?.hasNextPage}
      onLoadMore={() => {
        patientsQuery.refetch();
      }}
    />
  );
}
