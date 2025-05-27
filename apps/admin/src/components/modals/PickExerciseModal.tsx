import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalProps } from "@/hooks/useModale";
import { useExercises } from "@/queries/exercises/useExercises";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Plus, Search } from "lucide-react";
import Image from "next/image";
import { MrsModal, MrsModalContent, MrsModalTitle } from "../mrs/MrsModal";
const BODY_PARTS = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Abs",
  "Glutes",
  "Hamstrings",
  "Calves",
  "Neck",
];
interface PickExerciseModalProps extends ModalProps {
  onAddExercise: (exerciseId: string) => void;
}
export const PickExerciseModal = ({
  onAddExercise,
  ...props
}: PickExerciseModalProps) => {
  const exercisesQuery = useExercises();
  function handleAddExercise(exerciseId: string) {
    console.log({
      title: "Ajout d'un exercice",
      variant: "success",
      exerciseId,
    });
    onAddExercise(exerciseId);
    props.onClose?.();
  }
  return (
    <MrsModal {...props}>
      <MrsModalContent>
        <div className="flex flex-col flex-1 overflow-hidden w-full">
          <div className="border-b  space-y-3 flex flex-col w-full  p-4 box-border shadow-sm z-10">
            <MrsModalTitle>Exercices</MrsModalTitle>
            <div className="flex flex-row flex-wrap">
              <div className="relative w-full max-w-sm">
                <Input className="pl-10" placeholder="Rechercher" />
                <div className="absolute left-0 top-0 justify-center items-center flex h-full w-10 pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground " />
                </div>
              </div>
            </div>
            <div className="flex flex-row overflow-hidden items-start justify-start gap-1">
              {BODY_PARTS.map((part) => (
                <span
                  key={part}
                  className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded-xl cursor-pointer"
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex flex-col bg-muted/50 p-4 gap-2 flex-1 overflow-auto">
              <div className="flex flex-col gap-2">
                {exercisesQuery?.data?.pages
                  .flatMap((page) => page.items)
                  .map((exercise) => (
                    <div
                      className="flex flex-row p-3 space-x-2 border bg-background rounded-xl"
                      key={exercise.id}
                      onClick={() => handleAddExercise(exercise.id)}
                    >
                      <div className="w-12 h-12 aspect-square rounded-xl bg-muted border">
                        {exercise.photoUrl && (
                          <Image
                            src={exercise.photoUrl}
                            alt={exercise.title}
                            className="w-full h-full object-contain opacity-0"
                            onError={(e) => {
                              e.currentTarget.src = "/favicon.png"; // Chemin de l'image par défaut
                            }}
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col text-foreground">
                        <h3 className="text-foreground text-base font-semibold">
                          {exercise.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {exercise.description}
                        </p>
                        <div className="flex flex-row items-center justify-end pt-2">
                          <Button size="sm">
                            <Plus /> Ajouter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </MrsModalContent>
    </MrsModal>
  );
};
