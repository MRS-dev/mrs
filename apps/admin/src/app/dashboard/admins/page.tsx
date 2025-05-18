"use client";
import React from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { MrsQuery } from "@/components/mrs/MrsQuery";
import { AdminUserCard } from "@/components/AdminUserCard";
import { useAdmins } from "@/queries/admins/useAdmins";
import { useModal } from "@/hooks/useModale";
import { InviteAdminModal } from "@/components/modals/InviteAdminModal";
const Admins: React.FC = () => {
  const admins = useAdmins();
  const inviteAdminModal = useModal();
  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">Admins</h1>
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
                <Button onClick={() => inviteAdminModal.onOpen()}>
                  <Plus className="size-4" />
                  <span>Inviter un admin</span>
                </Button>
              </div>
            </div>
          </SidebarLayoutHeader>
        }
      >
        <div className="flex flex-1 flex-col gap-4 p-4 text-foreground">
          <MrsQuery
            query={admins}
            Data={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {admins.data?.map((admin) => (
                  <AdminUserCard
                    key={admin.id}
                    id={admin.id}
                    firstName={admin.firstName}
                    lastName={admin.lastName}
                    email={admin.email}
                  />
                ))}
              </div>
            }
          />
        </div>
      </SidebarLayout>
      <InviteAdminModal {...inviteAdminModal} />
    </>
  );
};

export default Admins;
