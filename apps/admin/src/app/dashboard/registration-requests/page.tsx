"use client";
import React, { useState } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import GridLayout from "@/components/mrs/GridLayout";
import { useRegistrationRequests } from "@/queries/registrationRequest/useRegistrationRequests";
import { RegistrationRequestCard } from "@/components/RegistrationRequestCard";
import { useModal } from "@/hooks/useModale";
import { RegistrationRequestDetailsModal } from "@/modals/RegistrationRequestDetailsModal";

const RegistrationRequests: React.FC = () => {
  const registrationRequests = useRegistrationRequests();
  const [selectedRegistrationRequest, setSelectedRegistrationRequest] =
    useState<string | null>(null);
  const registrationRequestDetailsModal = useModal();
  const onRegistrationRequest = (id: string) => {
    setSelectedRegistrationRequest(id);
    registrationRequestDetailsModal.onOpen();
  };
  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold line-clamp-1">
                Demande de kinés
              </h1>
            </div>
          </SidebarLayoutHeader>
        }
      >
        <div className="flex flex-1 flex-col gap-4 p-4 text-foreground">
          {registrationRequests.isLoading && <div>Chargement en cours...</div>}
          {registrationRequests.isError && (
            <div>Erreur : {registrationRequests.error?.message}</div>
          )}

          {!registrationRequests.isLoading && !registrationRequests.isError && (
            <GridLayout
              renderGridItem={(item) => (
                <RegistrationRequestCard
                  onClick={() => onRegistrationRequest(item.id)}
                  id={item.id}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  acceptedAt={
                    item.acceptedAt ? new Date(item.acceptedAt) : null
                  }
                  rejectedAt={
                    item.rejectedAt ? new Date(item.rejectedAt) : null
                  }
                  email={item.email}
                  phoneNumber={item.phoneNumber}
                  message={""}
                />
              )}
              keyExtractor={(registrationRequest) => registrationRequest.id}
              items={registrationRequests.data?.data || []}
              hasMore={false}
              onLoadMore={() => {}}
              isLoadingMore={false}
              isLoading={registrationRequests.isLoading}
            />
          )}
        </div>
      </SidebarLayout>
      <RegistrationRequestDetailsModal
        {...registrationRequestDetailsModal}
        id={selectedRegistrationRequest || ""}
      />
      {/* <MrsConfirmationModal
        {...confirmationModal}
        title="Supprimer l'admin"
        description="Voulez-vous vraiment supprimer l'admin ?"
        continueText="Supprimer"
        cancelText="Annuler"
      /> */}
      {/* <MrsCreateRegistrationRequestModal {...createRegistrationRequestModal} />
      <MrsRegistrationRequestDetailsModal
        {...registrationRequestDetailsModal}
        request={selectedRequest}
      /> */}
    </>
  );
};

export default RegistrationRequests;
