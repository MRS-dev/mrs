"use client";
import {
  MrsModal,
  MrsModalContent,
  MrsModalHeader,
  MrsModalTitle,
} from "@/components/mrs/MrsModal";
import { Button } from "@/components/ui/button";

import { ModalProps } from "@/hooks/useModale";
import { useAcceptRegistrationRequest } from "@/queries/registrationRequest/useAcceptRegistrationRequest";
import { useRegistrationRequest } from "@/queries/registrationRequest/useRegistrationRequest";
import { LoaderCircle } from "lucide-react";

interface RegistrationRequestDetailsModalProps extends ModalProps {
  id: string;
}

export const RegistrationRequestDetailsModal = ({
  id,
  ...props
}: RegistrationRequestDetailsModalProps) => {
  const registrationRequest = useRegistrationRequest(id);
  const acceptRegistrationRequest = useAcceptRegistrationRequest();

  const req = registrationRequest.data;
  return (
    <MrsModal {...props}>
      <MrsModalContent>
        <MrsModalHeader>
          <MrsModalTitle className="text-lg font-semibold">
            Détails de la demande d&apos;inscription
          </MrsModalTitle>
        </MrsModalHeader>
        <div className="space-y-4">
          <section className="border-b pb-4">
            <h3 className="font-medium text-muted-foreground">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <span className="block font-semibold">Prénom :</span>
                <span>{req?.firstName}</span>
              </div>
              <div>
                <span className="block font-semibold">Nom :</span>
                <span>{req?.lastName}</span>
              </div>
              <div>
                <span className="block font-semibold">Téléphone :</span>
                <span>{req?.phoneNumber}</span>
              </div>
              <div>
                <span className="block font-semibold">Email :</span>
                <span>{req?.email}</span>
              </div>
              <div>
                <span className="block font-semibold">Entreprise :</span>
                <span>{req?.companyName}</span>
              </div>
              <div>
                <span className="block font-semibold">SIRET :</span>
                <span>{req?.siret}</span>
              </div>
              <div>
                <span className="block font-semibold">RPPS :</span>
                <span>{req?.rpps}</span>
              </div>
              <div>
                <span className="block font-semibold">Statut :</span>
                <span className="capitalize">
                  {req?.acceptedAt
                    ? "Accepté"
                    : req?.rejectedAt
                      ? "Rejeté"
                      : "En attente"}
                </span>
              </div>
            </div>
            <Button
              onClick={() => acceptRegistrationRequest.mutate({ json: { id } })}
              disabled={acceptRegistrationRequest.isPending}
            >
              {acceptRegistrationRequest.isPending && (
                <LoaderCircle className="size-4 animate-spin" />
              )}
              <span>Accepter</span>
            </Button>
          </section>

          {/* <section className="border-b pb-4">
            <h3 className="font-medium text-muted-foreground">Date et Message</h3>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div>
                <span className="block font-semibold">Date de demande :</span>
                <span>
                  {new Date(req.requestedCallDateTime).toLocaleString("fr-FR")}
                </span>
              </div>
              <div>
                <span className="block font-semibold">Message :</span>
                <p className="text-sm text-muted-foreground">{req.message}</p>
              </div>
            </div>
          </section> */}

          {/* <section>
            <h3 className="font-medium text-muted-foreground">Documents</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <span className="block font-semibold">CNI :</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {req.cni?.map((path, index) => (
                    <img
                      key={index}
                      src={`${MEDIA_URL}${path}`}
                      alt={`CNI ${index + 1}`}
                      className="w-full h-auto rounded-md border object-contain"
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="block font-semibold">Carte de santé :</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {req.healthCard?.map((path, index) => (
                    <img
                      key={index}
                      src={`${MEDIA_URL}${path}`}
                      alt={`Carte de santé ${index + 1}`}
                      className="w-full h-auto rounded-md border object-contain"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section> */}
        </div>
      </MrsModalContent>
    </MrsModal>
  );
};
