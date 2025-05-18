"use client";
import React from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { useExercises } from "@/queries/exercises/useExercises";
import { MrsQuery } from "@/components/mrs/MrsQuery";
import { useModal } from "@/hooks/useModale";
import CreateExerciseModal from "@/components/modals/CreateExerciseModal";

const Exercises: React.FC = () => {
  const exercisesQuery = useExercises({
    page: 1,
    limit: 10,
  });

  const createExerciseModal = useModal();
  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">Exercices</h1>
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
                <Button onClick={createExerciseModal.onOpen}>
                  <Plus /> Créer un exercice
                </Button>
              </div>
            </div>
          </SidebarLayoutHeader>
        }
      >
        <div className="flex flex-1 flex-col gap-4 p-4 text-foreground">
          <MrsQuery
            query={exercisesQuery}
            Data={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercisesQuery.data?.items.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-background rounded-xl border shadow-sm p-4 flex flex-row items-start gap-2 hover:shadow-md cursor-pointer w-full overflow-hidden"
                  >
                    <div className="w-14 min-w-14 aspect-square rounded-xl bg-muted"></div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className=" flex flex-row items-center justify-between  truncate w-full">
                        <h3 className="text-base font-semibold truncate max-w-full text-ellipsis whitespace-nowrap">
                          {exercise.title}
                        </h3>
                        <div className="h-0 w-10 flex items-center justify-center">
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2  w-full">
                        {exercise.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            }
          />
        </div>
      </SidebarLayout>
      <CreateExerciseModal {...createExerciseModal} />
    </>
  );
};

export default Exercises;
