"use client";
import React, { useMemo, useState } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { useModal } from "@/hooks/useModale";
import GridLayout from "@/components/mrs/GridLayout";
import { useActivities } from "@/queries/activities/useActivities";
import { ActivityModal } from "@/components/modals/ActivityModal";

export default function Activities() {
  const activitiesQuery = useActivities();

  const activities = useMemo(() => {
    return activitiesQuery?.data?.pages.flatMap((page) => page.items);
  }, [activitiesQuery.data]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");

  const activityModal = useModal();
  const handleCreateActivity = () => {
    activityModal.onOpen();
    setSelectedActivityId("new");
  };
  const handleClickActivity = (activityId: string) => {
    setSelectedActivityId(activityId);
    activityModal.onOpen();
  };
  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">Activités</h1>
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
                  <Button onClick={handleCreateActivity}>
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
            items={activities || []}
            renderGridItem={(activity) => (
              <div
                onClick={() => handleClickActivity(activity.id)}
                key={activity.id}
                className="bg-background rounded-xl border shadow-sm p-4 flex flex-row items-start gap-2 hover:shadow-md cursor-pointer w-full overflow-hidden"
              >
                <div className="w-14 min-w-14 aspect-square rounded-xl bg-muted"></div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className=" flex flex-row items-center justify-between  truncate w-full">
                    <h3 className="text-base font-semibold truncate max-w-full text-ellipsis whitespace-nowrap">
                      {activity.title}
                    </h3>
                    <div className="h-0 w-10 flex items-center justify-center">
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2  w-full">
                    {activity.description}
                  </p>
                </div>
              </div>
            )}
            keyExtractor={(activity) => activity.id}
            isLoading={activitiesQuery.isLoading}
            hasMore={activitiesQuery.hasNextPage}
            onLoadMore={() => activitiesQuery.fetchNextPage()}
            isLoadingMore={activitiesQuery.isFetchingNextPage}
          />
        </div>
      </SidebarLayout>

      <ActivityModal
        {...activityModal}
        activityId={selectedActivityId}
        key={selectedActivityId}
      />
    </>
  );
}
