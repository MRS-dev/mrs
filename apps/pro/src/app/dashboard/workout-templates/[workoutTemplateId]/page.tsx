"use client";
import React, { useEffect, useState } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import {
  ExercisesEditor,
  useExercisesEditor,
} from "@/components/ExercisesEditor";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { useWorkoutTemplate } from "@/queries/workoutTemplates/useWorkoutTemplate";
import { useDeleteWorkoutTemplate } from "@/queries/workoutTemplates/useDeleteWorkoutTemplate";
import { ROUTES } from "@/routes";
import { useCreateWorkoutTemplate } from "@/queries/workoutTemplates/useCreateWorkoutTemplate";
import { useUpdateWorkoutTemplate } from "@/queries/workoutTemplates/useUpdateWorkoutTemplate";

const WorkoutTemplate: React.FC = () => {
  const router = useRouter();
  const { workoutTemplateId } = useParams<{ workoutTemplateId: string }>();
  const workoutTemplate = useWorkoutTemplate(workoutTemplateId);
  const deleteWorkoutTemplate = useDeleteWorkoutTemplate({
    onSuccess: () => {
      router.push(ROUTES.workoutTemplates);
    },
  });
  const [data, setData] = useState<{
    name: string;
    program: {
      exercises: {
        exerciseId: string;
        series: number;
        executionTime: number;
        restTime: number;
        repetitions: number;
      }[];
    };
  }>({
    name: "",
    program: { exercises: [] },
  });
  useEffect(() => {
    const newData = {
      name: workoutTemplate.data?.name || "",
      program: workoutTemplate.data?.program || { exercises: [] },
    };
    setData(newData);
  }, [workoutTemplate.data]);

  const onChange = (key: string, value: unknown) => {
    setData((v) => ({ ...v, [key]: value }));
  };
  useEffect(() => {
    console.log("data----->", data);
  }, [data]);
  const exercisesEditor = useExercisesEditor({
    exercises: data?.program?.exercises || [],
    onChangeExercises: (exercises) => {
      console.log({
        title: "Change exercises",
        variant: "success",
        exercises,
      });
      onChange("program", { exercises });
    },
  });
  const createWorkoutTemplate = useCreateWorkoutTemplate();
  const updateWorkoutTemplate = useUpdateWorkoutTemplate();
  return (
    <SidebarLayout
      Header={
        <SidebarLayoutHeader>
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
            <h1 className="text-2xl font-bold">
              {workoutTemplateId === "new" ? "Nouveau modèle" : data?.name}
            </h1>
            <div className="flex flex-row items-center justify-end gap-2">
              {workoutTemplateId && workoutTemplateId !== "new" && (
                <Button
                  onClick={() =>
                    deleteWorkoutTemplate.mutate({
                      param: { id: workoutTemplateId },
                    })
                  }
                  variant="destructive"
                  disabled={deleteWorkoutTemplate.isPending}
                >
                  {deleteWorkoutTemplate.isPending && (
                    <LoaderCircle className="mr-2 animate-spin" />
                  )}
                  Supprimer
                </Button>
              )}
              {workoutTemplateId === "new" ? (
                <Button
                  onClick={() =>
                    createWorkoutTemplate.mutate({
                      json: {
                        name: data.name,
                        program: data.program,
                      },
                    })
                  }
                  disabled={createWorkoutTemplate.isPending}
                >
                  {createWorkoutTemplate.isPending && (
                    <LoaderCircle className="mr-2 animate-spin" />
                  )}
                  Créer
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    updateWorkoutTemplate.mutate({
                      json: {
                        name: data.name,
                        program: data.program,
                      },
                      param: { id: workoutTemplateId },
                    })
                  }
                  disabled={updateWorkoutTemplate.isPending}
                >
                  {updateWorkoutTemplate.isPending && (
                    <LoaderCircle className="mr-2 animate-spin" />
                  )}
                  Sauvegarder
                </Button>
              )}
            </div>
          </div>
        </SidebarLayoutHeader>
      }
    >
      <div className="flex flex-1 flex-col gap-4 text-foreground  p-6 xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm mx-auto w-full">
        <div className="my-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Nom du modèle</h3>
            <Input
              value={workoutTemplate.data?.name}
              className="max-w-sm"
              onChange={(e) => onChange("name", e.target.value)}
              type="email"
            />
          </div>
        </div>
        <ExercisesEditor {...exercisesEditor} />
      </div>
    </SidebarLayout>
  );
};
export default WorkoutTemplate;
