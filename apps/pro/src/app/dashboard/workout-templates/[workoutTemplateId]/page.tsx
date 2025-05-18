import React from "react";
import { Button } from "@/components/ui/button";
import {
  BedDouble,
  Clock,
  EllipsisVertical,
  GripVertical,
  Layers,
  Plus,
  Repeat,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IonItem,
  IonReorder,
  IonReorderGroup,
  ItemReorderEventDetail,
} from "@ionic/react";
import { useExerciseQuery } from "@/hooks/useExerciseQuery";
import { Skeleton } from "./ui/skeleton";
import useModal from "@/hooks/useModal";
import { PickExerciseModal } from "@/components/PickExerciseModal";
import { ISessionExercice, ISessionProgram } from "@/types/session";
import { cn } from "@/lib/utils";
import { MrsPicker } from "@/components/mrs/MrsPicker";
import { MrsConfirmationModal } from "@/components/mrs/MrsConfirmationModal";

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

interface ExerciseEditorProps extends ReturnType<typeof useExercisesEditor> {
  className?: string;
  askConfirmationToDelete?: boolean;
}
export const ExercisesEditor = ({
  exercises,
  reorderExercises,
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
        onOpen={() => setSelectedExerciseId(null)}
        open={!!selectedExerciseId}
        onContinue={() => removeExercise(selectedExerciseId as string)}
        onOpenChange={() => setSelectedExerciseId(null)}
        onClose={() => setSelectedExerciseId(null)}
        onContinueLoading={false}
        title="Supprimer l'exercice"
        description="Voulez-vous vraiment supprimer cet exercice ?"
      />
      <PickExerciseModal {...pickExerciseModal} onAddExercise={addExercise} />

      <div className={cn("flex flex-col", className)}>
        <div className="flex flex-row items-center justify-between gap-2 pb-4">
          <h2 className="text-lg font-semibold">
            Exercices{" "}
            <span className="text-muted-foreground">
              ({exercises?.length || 0})
            </span>
          </h2>
          <Button onClick={pickExerciseModal.open}>
            <Plus className="size-4" />
            Ajouter un exercice
          </Button>
        </div>
        {!exercises?.length ? (
          <div className="flex flex-col items-center justify-center p-4 bg-primary/10 backdrop-blur-md rounded-xl text-primary min-h-44">
            <h3 className="text-lg font-semibold m-0">Aucun exercice</h3>
            <p className="text-base">Ajoutez des exercices à la séance</p>
            <Button className="mt-4" onClick={pickExerciseModal.open}>
              <Plus className="size-4" />
              Ajouter un exercice
            </Button>
          </div>
        ) : (
          <IonReorderGroup
            disabled={false}
            onIonItemReorder={reorderExercises}
            className="flex flex-1 flex-col gap-2 rounded-xl"
          >
            {exercises.map((exercise) => {
              console.log(exercise);
              return (
                <ProgramExercise
                  {...exercise}
                  key={exercise.exerciseId}
                  onRemove={() =>
                    askConfirmationToDelete
                      ? setSelectedExerciseId(exercise.exerciseId)
                      : removeExercise(exercise.exerciseId)
                  }
                  onChange={(value) =>
                    changeExercise(exercise.exerciseId, value)
                  }
                />
              );
            })}
          </IonReorderGroup>
        )}
      </div>
    </>
  );
};

interface UseExercisesEditorProps {
  exercises: ISessionExercice[];
  onChangeExercises: (value: ISessionExercice[]) => void;
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

  const addExercise = (exerciseId: string) => {
    if (exercises?.find((item) => item.exerciseId === exerciseId)) {
      console.log({
        title: "Cet exercice est déjà dans le programme",
        variant: "destructive",
      });
      return;
    }
    onChangeExercises([...exercises, { exerciseId }]);
  };
  const reorder = (array: ISessionExercice[], from: number, to: number) => {
    const newArray = [...array];
    const [removed] = newArray.splice(from, 1);
    newArray.splice(to, 0, removed);
    return newArray;
  };

  function reorderExercises(event: CustomEvent<ItemReorderEventDetail>) {
    const { from, to } = event.detail;
    onChangeExercises(reorder(exercises, from, to));

    event.detail.complete();
  }

  function changeExercise(
    exerciseId: string,
    updatedExercise: Partial<Omit<ISessionExercice, "exerciseId">>
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
    reorderExercises,
  };
};
interface ProgramExerciseProps extends ISessionExercice {
  onRemove: () => void;
  onChange: (value: Partial<Omit<ISessionExercice, "exerciseId">>) => void;
}
const ProgramExercise = ({
  exerciseId,
  series,
  executionTime,
  restTime,
  repetitions,
  onChange,
  onRemove,
}: ProgramExerciseProps) => {
  const { data, isFetching } = useExerciseQuery(exerciseId);
  const { title, description, photoUrl } = data || {};
  return (
    <IonItem
      key={exerciseId}
      lines="none"
      className="ion-no-padding w-full rounded-xl "
      style={{
        "--inner-padding-end": "0",
        "--inner-padding-start": "0",
      }}
    >
      <div className="flex flex-row border rounded-xl w-full" key={exerciseId}>
        <IonReorder>
          <div className="hover:bg-muted p-3 pt-7  h-full">
            <GripVertical className="size-5 text-muted-foreground/50" />
          </div>
        </IonReorder>
        <div className="flex flex-row gap-2 flex-1 py-4 pr-4">
          <div className="w-12 h-12 aspect-square rounded-xl bg-muted border overflow-hidden">
            {isFetching ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <img
                src={photoUrl}
                alt={title}
                className="w-full h-full object-contain opacity-0"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col text-foreground">
            {isFetching ? (
              <Skeleton className="h-4 w-full max-w-40 rounded-xl mb-2" />
            ) : (
              <h3 className="text-foreground text-base font-semibold">
                {title}
              </h3>
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
                onChange={(value) => onChange({ series: value })}
              />
              <MrsPicker
                icon={<Clock className="size-4" />}
                label="Durée"
                placeholder="0"
                options={OPTIONS_DURATION}
                value={executionTime}
                onChange={(value) => onChange({ executionTime: value })}
              />
              <MrsPicker
                icon={<BedDouble className="size-4" />}
                label="Repos"
                placeholder="0"
                options={OPTIONS_DURATION}
                value={restTime}
                onChange={(value) => onChange({ restTime: value })}
              />
              <MrsPicker
                icon={<Repeat className="size-4" />}
                label="Répétitions"
                placeholder="0"
                options={OPTIONS_SERIES}
                value={repetitions}
                onChange={(value) => onChange({ repetitions: value })}
              />
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="!rounded-xl">
                <DropdownMenuItem
                  className="rounded-md text-red-500 cursor-pointer hover:bg-red-500/10 hover:text-red-500 focus:bg-red-500/10 focus:text-red-500 active:bg-red-500/10 active:text-red-500"
                  onClick={() => onRemove()}
                >
                  <Trash className="mr-2 size-4" />
                  <span>Supprimer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </IonItem>
  );
};
