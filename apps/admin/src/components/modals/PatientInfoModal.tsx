"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  CreditCard,
  AlertTriangle,
  UserCheck
} from "lucide-react";

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

interface PatientInfoModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

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

const InfoRow = ({ 
  icon: Icon, 
  label, 
  value, 
  className 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | null | undefined;
  className?: string;
}) => {
  if (!value) return null;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-muted-foreground">{label}:</span>
        <span className="ml-2 text-sm">{value}</span>
      </div>
    </div>
  );
};

export const PatientInfoModal: React.FC<PatientInfoModalProps> = ({
  patient,
  isOpen,
  onClose,
}) => {
  if (!patient) return null;

  const age = patient.birthDate 
    ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear()
    : null;

  const formattedBirthDate = patient.birthDate
    ? format(new Date(patient.birthDate), "dd MMMM yyyy", { locale: fr })
    : null;

  const fullAddress = patient.address
    ? `${patient.address.street}${
        patient.address.complement ? `, ${patient.address.complement}` : ""
      }, ${patient.address.postalCode} ${patient.address.city}, ${patient.address.country}`
    : null;

  const emergencyContactName = patient.emergencyContact?.firstName || patient.emergencyContact?.lastName
    ? `${patient.emergencyContact.firstName || ""} ${patient.emergencyContact.lastName || ""}`.trim()
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold">
                {patient.firstName} {patient.lastName}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {patient.status && (
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(patient.status)}
                  >
                    {getStatusLabel(patient.status)}
                  </Badge>
                )}
                {age && (
                  <span className="text-sm text-muted-foreground">
                    {age} ans
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations personnelles
            </h3>
            <div className="space-y-3 pl-6">
              <InfoRow
                icon={Mail}
                label="Email"
                value={patient.email}
              />
              <InfoRow
                icon={Phone}
                label="Téléphone"
                value={patient.phoneNumber}
              />
              <InfoRow
                icon={Calendar}
                label="Date de naissance"
                value={formattedBirthDate || undefined}
              />
              <InfoRow
                icon={CreditCard}
                label="Numéro de sécurité sociale"
                value={patient.socialSecurityNumber}
              />
            </div>
          </div>

          {/* Adresse */}
          {fullAddress && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse
                </h3>
                <div className="pl-6">
                  <p className="text-sm text-foreground">{fullAddress}</p>
                </div>
              </div>
            </>
          )}

          {/* Contact d'urgence */}
          {(emergencyContactName || patient.emergencyContact?.phoneNumber || patient.emergencyContact?.email) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Contact d&apos;urgence
                </h3>
                <div className="space-y-3 pl-6">
                  {emergencyContactName && (
                    <InfoRow
                      icon={User}
                      label="Nom"
                      value={emergencyContactName}
                    />
                  )}
                  <InfoRow
                    icon={Phone}
                    label="Téléphone"
                    value={patient.emergencyContact?.phoneNumber}
                  />
                  {patient.emergencyContact?.phoneNumber2 && (
                    <InfoRow
                      icon={Phone}
                      label="Téléphone 2"
                      value={patient.emergencyContact.phoneNumber2}
                    />
                  )}
                  <InfoRow
                    icon={Mail}
                    label="Email"
                    value={patient.emergencyContact?.email}
                  />
                </div>
              </div>
            </>
          )}

          {/* Allergies */}
          {patient.allergies && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Allergies
                </h3>
                <div className="pl-6">
                  <p className="text-sm text-foreground">{patient.allergies}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientInfoModal;