"use client";
import React, { useMemo, useState } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { usePatients } from "@/queries/patients";
import GridLayout from "@/components/mrs/GridLayout";

const Patients: React.FC = () => {
  // const [status, setStatus] = useState<string[]>([
  //   "VERIFIED",
  //   "PENDING_VERIFICATIONS",
  // ]);

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
  return (
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
            <div className="bg-background rounded-xl border shadow-sm p-4 flex flex-row items-start gap-2 hover:shadow-md cursor-pointer justify-start">
              <Avatar>
                <AvatarFallback className="bg-primary/20 text-primary">
                  {item.firstName.charAt(0)}
                  {item.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 space-y-1">
                <h3 className="text-base font-semibold line-clamp-1">
                  {item.firstName} {item.lastName}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 w-full">
                  {format(new Date(item.birthDate), "dd/MM/yyyy")}
                </p>
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
  );
};

export default Patients;
