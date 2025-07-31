import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalProps } from "@/hooks/useModale";
import { useExercises } from "@/queries/exercises/useExercises";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const exercisesQuery = useExercises({ limit: 10 });
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
      <MrsModalContent className="max-w-2xl h-[80vh] flex flex-col">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header fixe */}
          <div className="border-b space-y-3 flex flex-col w-full p-4 box-border shadow-sm z-10 flex-shrink-0">
            <MrsModalTitle>Exercices</MrsModalTitle>
            <div className="flex flex-row flex-wrap">
              <div className="relative w-full max-w-sm">
                <Input className="pl-10" placeholder="Rechercher" />
                <div className="absolute left-0 top-0 justify-center items-center flex h-full w-10 pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground " />
                </div>
              </div>
            </div>
            <div className="flex flex-row overflow-x-auto items-start justify-start gap-1 pb-2">
              {BODY_PARTS.map((part) => (
                <span
                  key={part}
                  className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded-xl cursor-pointer whitespace-nowrap"
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
          
          {/* Contenu scrollable */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full w-full">
              <div className="p-4 bg-muted/50">
                <div className="flex flex-col gap-2">
                  {exercisesQuery?.data?.items.map((exercise) => (
                    <div
                      className="flex flex-row p-3 space-x-2 border bg-background rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                      key={exercise.id}
                      onClick={() => handleAddExercise(exercise.id)}
                    >
                      <div className="w-12 h-12 aspect-square rounded-xl bg-muted border flex-shrink-0">
                        {exercise.photoUrl && (
                          <Image
                            src={exercise.photoUrl}
                            alt={exercise.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.currentTarget.src = "/favicon.png";
                            }}
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col text-foreground min-w-0">
                        <h3 className="text-foreground text-base font-semibold">
                          {exercise.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {exercise.description}
                        </p>
                        <div className="flex flex-row items-center justify-end pt-2">
                          <Button size="sm" variant="primary-light">
                            <Plus className="w-4 h-4" /> Ajouter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Message si aucun exercice */}
                  {exercisesQuery?.data?.items.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun exercice trouvé
                    </div>
                  )}
                  
                  {/* Loading */}
                  {exercisesQuery.isLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      Chargement des exercices...
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </MrsModalContent>
    </MrsModal>
  );
};
