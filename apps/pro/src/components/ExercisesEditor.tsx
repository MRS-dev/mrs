import React from "react";
import { Button } from "@/components/ui/button";
import { BedDouble, Clock, Layers, Plus, Repeat, Trash } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { MrsPicker } from "./mrs/MrsPicker";
import Image from "next/image";
import { MrsConfirmationModal } from "./mrs/MrsConfirmationModal";
import { useModal } from "@/hooks/useModale";
import { useExercise } from "@/queries/exercises/useExercise";
import { PickExerciseModal } from "./modals/PickExerciseModal";
import { Reorderable } from "./Reorderable";

export interface Exercise {
  exerciseId: string;
  series: number;
  executionTime: number;
  restTime: number;
  repetitions: number;
}
interface ExerciseEditorProps extends ReturnType<typeof useExercisesEditor> {
  className?: string;
  askConfirmationToDelete?: boolean;
}
export const ExercisesEditor = ({
  exercises,
  onChangeExercises,
  removeExercise,
  addExercise,
  changeExercise,
  selectedExerciseId,
  setSelectedExerciseId,
  className,
  askConfirmationToDelete = true,
}: ExerciseEditorProps) => {
  const pickExerciseModal = useModal();
  return (
    <>
      <MrsConfirmationModal
        open={!!selectedExerciseId}
        onContinue={() => {
          removeExercise(selectedExerciseId as string);
          setSelectedExerciseId(null);
        }}
        onOpenChange={() => setSelectedExerciseId(null)}
        onContinueLoading={false}
        title="Supprimer l'exercice"
        description="Voulez-vous vraiment supprimer cet exercice ?"
        onClose={() => setSelectedExerciseId(null)}
        onOpen={() => setSelectedExerciseId(selectedExerciseId as string)}
      />
      <PickExerciseModal
        {...pickExerciseModal}
        onAddExercise={(exerciseId) => {
          addExercise(exerciseId);
          pickExerciseModal.onClose();
        }}
      />
      <div className={cn("flex flex-col", className)}>
        <div className="flex flex-row items-center justify-between gap-2 pb-4">
          <h2 className="text-lg font-semibold">
            Exercices{" "}
            <span className="text-muted-foreground">
              ({exercises?.length || 0})
            </span>
          </h2>
          <Button onClick={pickExerciseModal.onOpen}>
            <Plus className="size-4" />
            Ajouter un exercice
          </Button>
        </div>
        <Reorderable
          items={exercises}
          onReorder={onChangeExercises}
          getItemId={(exercise) => exercise.exerciseId}
          emptyMessage={
            <div className="flex flex-col items-center justify-center p-4 bg-primary/10 backdrop-blur-md rounded-xl text-primary min-h-44">
              <h3 className="text-lg font-semibold m-0">Aucun exercice</h3>
              <p className="text-base">Ajoutez des exercices à la séance</p>
              <Button className="mt-4" onClick={pickExerciseModal.onOpen}>
                <Plus className="size-4" />
                Ajouter un exercice
              </Button>
            </div>
          }
          renderItem={(exercise) => (
            <div className="flex flex-row gap-2 w-full">
              <ExerciseCard
                exerciseId={exercise.exerciseId}
                series={exercise.series}
                executionTime={exercise.executionTime}
                restTime={exercise.restTime}
                repetitions={exercise.repetitions}
                onSeriesChange={(value) =>
                  changeExercise(exercise.exerciseId, { series: value })
                }
                onExecutionTimeChange={(value) =>
                  changeExercise(exercise.exerciseId, { executionTime: value })
                }
                onRestTimeChange={(value) =>
                  changeExercise(exercise.exerciseId, { restTime: value })
                }
                onRepetitionsChange={(value) =>
                  changeExercise(exercise.exerciseId, { repetitions: value })
                }
                onRemove={() =>
                  askConfirmationToDelete
                    ? setSelectedExerciseId(exercise.exerciseId)
                    : removeExercise(exercise.exerciseId)
                }
              />
            </div>
          )}
        />
      </div>
    </>
  );
};

interface UseExercisesEditorProps {
  exercises: Exercise[];
  onChangeExercises: (value: Exercise[]) => void;
}
export const useExercisesEditor = ({
  exercises,
  onChangeExercises,
}: UseExercisesEditorProps) => {
  const [selectedExerciseId, setSelectedExerciseId] = React.useState<
    string | null
  >(null);

  const removeExercise = (exerciseId: string) => {
    onChangeExercises(
      exercises.filter((item) => item.exerciseId !== exerciseId)
    );
  };
  console.log({
    title: "Exercises",
    variant: "info",
    exercises,
  });
  const addExercise = (exerciseId: string) => {
    console.log({
      title: "Add exercise",
      variant: "in function",
      exerciseId,
    });

    if (exercises?.find((item) => item.exerciseId === exerciseId)) {
      console.log({
        title: "Cet exercice est déjà dans le programme",
        variant: "destructive",
      });
      return;
    }

    console.log({
      title: "Ajout d'un exercice",
      variant: "success",
      exerciseId,
    });
    onChangeExercises([
      ...exercises,
      { exerciseId, series: 1, executionTime: 0, restTime: 0, repetitions: 0 },
    ]);
  };

  function changeExercise(
    exerciseId: string,
    updatedExercise: Partial<Omit<Exercise, "exerciseId">>
  ) {
    onChangeExercises(
      exercises.map((exercise) =>
        exercise.exerciseId === exerciseId
          ? { ...exercise, ...updatedExercise }
          : exercise
      )
    );
  }

  return {
    selectedExerciseId,
    setSelectedExerciseId,
    exercises,
    onChangeExercises,
    addExercise,
    removeExercise,
    changeExercise,
  };
};

interface ProgramExerciseProps {
  exerciseId: string;
  series: number;
  executionTime: number;
  restTime: number;
  repetitions: number;
  onSeriesChange: (value?: number) => void;
  onExecutionTimeChange: (value?: number) => void;
  onRestTimeChange: (value?: number) => void;
  onRepetitionsChange: (value?: number) => void;
  onRemove: () => void;
}

const ExerciseCard = ({
  exerciseId,
  series,
  executionTime,
  restTime,
  repetitions,
  onSeriesChange,
  onExecutionTimeChange,
  onRestTimeChange,
  onRepetitionsChange,
  onRemove,
}: ProgramExerciseProps) => {
  const query = useExercise(exerciseId);
  const isFetching = query.isFetching;
  const { title = "", description = "", photoUrl = "" } = query.data || {};

  return (
    <div className="flex flex-row gap-2 flex-1 px-4">
      <div className="w-12 h-12 aspect-square rounded-xl bg-muted border overflow-hidden">
        {isFetching ? (
          <Skeleton className="h-full w-full" />
        ) : (
          !!photoUrl && (
            <Image
              src={photoUrl as string}
              alt={title as string}
              className="w-full h-full object-contain opacity-0"
            />
          )
        )}
      </div>
      <div className="flex flex-1 flex-col text-foreground">
        {isFetching ? (
          <Skeleton className="h-4 w-full max-w-40 rounded-xl mb-2" />
        ) : (
          <h3 className="text-foreground text-base font-semibold">{title}</h3>
        )}
        {isFetching ? (
          <>
            <Skeleton className="h-3 w-full rounded-xl mb-1" />
            <Skeleton className="h-3 w-1/2 rounded-xl" />
          </>
        ) : (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex flex-row items-center justify-start pt-2 gap-3 flex-wrap">
          <MrsPicker
            icon={<Layers className="size-4" />}
            label="Séries"
            placeholder="0"
            options={OPTIONS_SERIES}
            value={series}
            onChange={(value) => onSeriesChange(value)}
          />
          <MrsPicker
            icon={<Clock className="size-4" />}
            label="Durée"
            placeholder="0"
            options={OPTIONS_DURATION}
            value={executionTime}
            onChange={(value) => onExecutionTimeChange(value)}
          />
          <MrsPicker
            icon={<BedDouble className="size-4" />}
            label="Repos"
            placeholder="0"
            options={OPTIONS_DURATION}
            value={restTime}
            onChange={(value) => onRestTimeChange(value)}
          />
          <MrsPicker
            icon={<Repeat className="size-4" />}
            label="Répétitions"
            placeholder="0"
            options={OPTIONS_SERIES}
            value={repetitions}
            onChange={(value) => onRepetitionsChange(value)}
          />
        </div>
      </div>
      <div>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash className="size-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

const OPTIONS_SERIES = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
  {
    value: 6,
    label: "6",
  },
  {
    value: 7,
    label: "7",
  },
  {
    value: 8,
    label: "8",
  },
  {
    value: 9,
    label: "9",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 12,
    label: "12",
  },
  {
    value: 15,
    label: "15",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 25,
    label: "25",
  },
  {
    value: 30,
    label: "30",
  },
  {
    value: 35,
    label: "35",
  },
  {
    value: 40,
    label: "40",
  },
  {
    value: 45,
    label: "45",
  },
  {
    value: 50,
    label: "50",
  },
];

const OPTIONS_DURATION = [
  {
    value: 5,
    label: "5 secondes",
  },
  {
    value: 10,
    label: "10 secondes",
  },
  {
    value: 15,
    label: "15 secondes",
  },
  {
    value: 20,
    label: "20 secondes",
  },
  {
    value: 25,
    label: "25 secondes",
  },
  {
    value: 30,
    label: "30 secondes",
  },
  {
    value: 35,
    label: "35 secondes",
  },
  {
    value: 40,
    label: "40 secondes",
  },
  {
    value: 45,
    label: "45 secondes",
  },
  {
    value: 50,
    label: "50 secondes",
  },
  {
    value: 55,
    label: "55 secondes",
  },
  {
    value: 60,
    label: "1 minute",
  },
  {
    value: 75,
    label: "1 minutes 15 secondes",
  },
  {
    value: 90,
    label: "1 minutes 30 secondes",
  },
  {
    value: 105,
    label: "1 minutes 45 secondes",
  },
  {
    value: 120,
    label: "2 minutes",
  },
  {
    value: 180,
    label: "3 minutes",
  },
  {
    value: 240,
    label: "4 minutes",
  },
  {
    value: 300,
    label: "5 minutes",
  },
];
