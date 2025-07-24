"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useDeletePatient } from "@/queries/patients/useDeletePatient";
import { toast } from "sonner";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface DeletePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSuccess?: () => void;
}

export const DeletePatientModal: React.FC<DeletePatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSuccess,
}) => {
  const deletePatient = useDeletePatient({
    onSuccess: () => {
      toast.success("Patient supprimé avec succès!", {
        description: "Le patient et toutes ses données associées ont été supprimés.",
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description: error.message || "Une erreur s'est produite lors de la suppression du patient.",
      });
    },
  });

  const handleDelete = () => {
    if (patient) {
      deletePatient.mutate(patient.id);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Supprimer le patient</DialogTitle>
              <DialogDescription>
                Cette action est irréversible.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer le patient{" "}
            <span className="font-semibold text-foreground">
              {patient.firstName} {patient.lastName}
            </span>{" "}
            ? Cette action supprimera définitivement:
          </p>
          <ul className="mt-3 list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Toutes les informations du patient</li>
            <li>L&apos;historique des séances</li>
            <li>Les messages associés</li>
            <li>Les rapports de progression</li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deletePatient.isPending}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deletePatient.isPending}
          >
            {deletePatient.isPending ? "Suppression..." : "Supprimer définitivement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePatientModal;