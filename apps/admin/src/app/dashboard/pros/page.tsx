"use client";
import React, { useMemo } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  ChevronRight,
  MapPinIcon,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { useModal } from "@/hooks/useModale";
import GridLayout from "@/components/mrs/GridLayout";
import { usePros } from "@/queries/pros/usePros";
import Link from "next/link";
import { ROUTES } from "@/routes";
import { MrsAvatar } from "@/components/mrs/MrsAvatar";
import { format } from "date-fns";

export default function Pros() {
  const prosQuery = usePros();

  const pros = useMemo(() => {
    return prosQuery?.data?.pages.flatMap((page) => page.items);
  }, [prosQuery.data]);

  const createExerciseModal = useModal();
  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">Les kinés</h1>
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
                <div className="flex flex-row items-center space-x-3">
                  {/* <Button
                    variant="primary-light"
                    onClick={() => importExercisesModal.open()}
                  >
                    <span>Importer</span>
                  </Button> */}
                  <Button onClick={createExerciseModal.onOpen}>
                    <Plus className="size-4" />
                    <span>Créer</span>
                  </Button>
                </div>
              </div>
            </div>
          </SidebarLayoutHeader>
        }
      >
        <div className="h-full flex-1 p-6 xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm mx-auto w-full">
          <GridLayout
            items={pros || []}
            renderGridItem={(pro) => (
              <Link
                href={ROUTES.pro("test")}
                className="bg-background rounded-xl border shadow-sm p-4 flex flex-row items-start gap-2 hover:shadow-md cursor-pointer"
              >
                <MrsAvatar
                  src="/placeholder.svg?height=40&width=40"
                  alt="John Doe"
                  className="size-10"
                  size={40}
                  displayName={`${pro?.firstName.slice(0, 1)}${pro?.lastName.slice(0, 1)}`}
                />
                <div className="flex flex-col flex-1">
                  <div className="h-11 flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center justify-betweengap-2 w-full">
                      <div className="flex flex-col flex-1">
                        <h3 className="text-base font-semibold line-clamp-1">
                          {pro?.firstName + " " + pro?.lastName}
                        </h3>
                      </div>
                      {/* <DoctorBadge status={"AWAITING_VERIFICATIONS"} /> */}
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <MapPinIcon className="w-4 h-4 text-primary" />
                    {/* <p className="text-sm text-muted-foreground">
                      {pro?.city}
                    </p> */}
                  </div>
                  <div className="flex flex-row items-center gap-1 space-y-1">
                    <CalendarCheck className="w-4 h-4 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {format(pro?.createdAt, "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              </Link>
            )}
            keyExtractor={(pro) => pro.id}
            isLoading={prosQuery.isLoading}
            hasMore={prosQuery.hasNextPage}
            onLoadMore={() => prosQuery.fetchNextPage()}
            isLoadingMore={prosQuery.isFetchingNextPage}
          />
        </div>
      </SidebarLayout>

      {/* <CreateExerciseModal {...createExerciseModal} /> */}
    </>
  );
}
