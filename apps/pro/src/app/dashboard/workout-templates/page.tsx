"use client";
import React from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  BedDouble,
  ChevronRight,
  Clock,
  Layers,
  Plus,
  Repeat,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { ROUTES } from "@/routes";
import Link from "next/link";
import { MrsQuery } from "@/components/mrs/MrsQuery";
import { formatTime } from "@/lib/date";
import { useWorkoutTemplates } from "@/queries/workoutTemplates/useWorkoutTemplates";
import { useExercise } from "@/queries/exercises/useExercise";

const ITEMS_PER_PAGE = 10;
const ProgramTemplates: React.FC = () => {
  const workoutTemplates = useWorkoutTemplates({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  return (
    <SidebarLayout
      Header={
        <SidebarLayoutHeader>
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
            <h1 className="text-2xl font-bold">
              Modèles de programme
              <span className="text-muted-foreground font-medium text-2xl ml-2">
                ({workoutTemplates.data?.items.length}/
                {workoutTemplates.data?.pageInfo.totalCount})
              </span>
            </h1>
            <div className="flex flex-row items-center space-x-3">
              <div className="relative">
                <Input type="text" placeholder="Rechercher" className="pl-10" />
                <div className="absolute left-0 top-0 justify-center items-center flex h-full w-10 pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground " />
                </div>
              </div>
              <Button asChild>
                <Link href={ROUTES.workoutTemplate("new")}>
                  <Plus /> Nouveau modèle
                </Link>
              </Button>
            </div>
          </div>
        </SidebarLayoutHeader>
      }
    >
      {/* <div className="w-full rounded-xl bg-primary/10 backdrop-blur-md p-5 text-primary ">
                <div className="flex flex-row items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Modèles de programme
                  </h3>
                  <Button variant="primary-light" size="icon">
                    <X className="size-4" />
                  </Button>
                </div>
                <p className="text-base">
                  Vous pouvez créer un modèle de programme et l'utiliser pour
                  créer des séances plus rapidement
                </p>
                <div className="flex flex-row items-center justify-start">
                  <Button variant="primary" asChild className="mt-4">
                    <Link to={ROUTES.programTemplate("new")}>
                      <Plus className="size-4" />
                      Créer un modèle
                    </Link>
                  </Button>
                </div>
              </div> */}
      <div className="flex flex-1 flex-col gap-4 text-foreground  p-6 xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm mx-auto w-full">
        <MrsQuery
          query={workoutTemplates}
          Data={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workoutTemplates.data?.items.map((workoutTemplate) => (
                <Link
                  href={ROUTES.workoutTemplate(workoutTemplate.id as string)}
                  key={workoutTemplate.id}
                  className="bg-background rounded-xl border shadow-sm flex flex-col items-start  hover:shadow-md cursor-pointer"
                >
                  <div className="h-11 flex flex-row items-center justify-between w-full p-4 pr-1">
                    <h3 className="text-base font-semibold line-clamp-1 w-fulls">
                      {workoutTemplate.name}
                    </h3>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col w-full border-t h-32 overflow-hidden bg-muted relative">
                    {workoutTemplate.program?.exercises?.map((exercise) => (
                      <WorkoutExerciseCard
                        key={exercise.exerciseId}
                        exerciseId={exercise.exerciseId}
                        executionTime={exercise.executionTime}
                        repetitions={exercise.repetitions}
                        series={exercise.series}
                        restTime={exercise.restTime}
                      />
                    ))}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent"></div>
                  </div>
                  <div className="flex flex-row items-center justify-between w-full px-4  py-2 ">
                    <p className="text-xs text-muted-foreground">
                      {workoutTemplate.program?.exercises?.length || 0}{" "}
                      exercices
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Durée estimée{" "}
                      {formatTime(
                        workoutTemplate.program?.exercises?.reduce(
                          (acc, exercise) =>
                            acc +
                            (exercise?.executionTime || 0) *
                              (exercise?.series || 0),
                          0
                        ) || 0
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          }
          Empty={
            <div className="flex flex-col items-center justify-center p-4 bg-primary/10 backdrop-blur-md rounded-xl text-primary min-h-44">
              <h3 className="text-lg font-semibold m-0">
                Aucun modèle de programme
              </h3>
              <p className="text-base">Créez un nouveau modèle de programme</p>
              <Button
                className="mt-4"
                // onClick={pickExerciseModal.open}
                asChild
              >
                <Link href={ROUTES.workoutTemplate("new")}>
                  <Plus className="size-4" />
                  Créer un modèle
                </Link>
              </Button>
            </div>
          }
        />
      </div>
    </SidebarLayout>
  );
};

const WorkoutExerciseCard: React.FC<{
  exerciseId: string;
  executionTime: number;
  repetitions: number;
  series: number;
  restTime: number;
}> = ({ exerciseId, executionTime, repetitions, series, restTime }) => {
  const exercise = useExercise(exerciseId);
  return (
    <div className="flex-row flex items-center p-3 w-full border-b gap-2 bg-background">
      <div className="w-12 aspect-square rounded-xl bg-muted"></div>
      <div>
        <h4 className="text-sm font-medium line-clamp-1">
          {exercise?.data?.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {exercise?.data?.description}
        </p>
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-row items-center gap-1 text-xs">
            <Clock className="size-3 text-primary" />
            <p className="text-xs text-muted-foreground">{executionTime} s</p>
          </div>
          <div className="flex flex-row items-center gap-1 text-xs">
            <Repeat className="size-3 text-primary" />
            <p className="text-xs text-muted-foreground">{repetitions}</p>
          </div>
          <div className="flex flex-row items-center gap-1 text-xs">
            <Layers className="size-3 text-primary" />
            <p className="text-xs text-muted-foreground">{series}</p>
          </div>
          <div className="flex flex-row items-center gap-1 text-xs">
            <BedDouble className="size-3 text-primary" />
            <p className="text-xs text-muted-foreground">{restTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgramTemplates;
