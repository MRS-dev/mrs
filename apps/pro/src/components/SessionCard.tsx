import {
  EllipsisVertical,
  LoaderCircle,
  Pencil,
  Trash2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";
import { fr } from "date-fns/locale/fr";
import { format } from "date-fns";
import { useDeleteWorkoutSession } from "@/queries/workoutSessions/useDeleteWorkoutSession";
import { useModal } from "@/hooks/useModale";
import { SimpleCheckbox } from "./SimpleCheckbox";
import { useWorkoutSession } from "@/queries/workoutSessions/useWorkoutSession";
import Link from "next/link";
import { MrsConfirmationModal } from "./mrs/MrsConfirmationModal";

interface SessionCardProps {
  mode: "select" | "default";
  onSelect: () => void;
  onClick: () => void;
  selected: boolean;
  onDeleteSuccess?: () => void;
  workoutSessionId: string;
}
export const SessionCard = ({
  mode,
  onSelect,
  onClick,
  selected,
  workoutSessionId,
  onDeleteSuccess,
}: SessionCardProps) => {
  const workoutSession = useWorkoutSession(workoutSessionId);
  const deleteWorkoutSession = useDeleteWorkoutSession({
    onSuccess: () => {
      onDeleteSuccess?.();
      // toast({
      //   title: "Séance supprimée",
      //   description: "La séance a été supprimée avec succès",
      //   variant: "success",
      // });
    },
    onError: (error) => {
      console.log("ERROR", error);
      // toast({
      //   title: "Erreur",
      //   description: "La séance n'a pas été supprimée",
      //   variant: "destructive",
      // });
    },
  });
  const confirmDeleteModal = useModal();
  const date = workoutSession.data?.date || "";
  return (
    <button
      className={cn(
        "flex flex-col bg-background p-4 border rounded-xl",
        selected && "border-primary"
      )}
      onClick={mode === "select" ? onSelect : onClick}
    >
      <div className="flex flex-row justify-between items-center w-full">
        <h3 className="text-base font-medium text-foreground line-clamp-1 truncate">
          {!!date &&
            `Séance du ${format(date, "dd MMMM yyyy", {
              locale: fr,
            })}`}
          <span className="text-xs text-muted-foreground ml-2">
            {workoutSession.data?.program?.exercises?.length} exercice
          </span>
        </h3>
        <div className="flex items-center justify-end w-6 h-6 overflow-visible">
          {mode === "select" ? (
            <SimpleCheckbox
              checked={selected}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="min-w-10">
                  <EllipsisVertical className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-56">
                <DropdownMenuItem
                  className="cursor-pointer items-start"
                  asChild
                >
                  <Link href={ROUTES.editSession(workoutSessionId || "")}>
                    <Pencil className="mt-1" />
                    <span>Modifier</span>
                  </Link>
                </DropdownMenuItem>

                {/* <DropdownMenuItem className="cursor-pointer items-start" asChild>
                  <Link
                    to={ROUTES.newSession + "?patientId=" + session.patientId}
                  >
                    <CalendarClock className="mt-1" />
                    <span>Reprogrammer</span>
                  </Link>
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem
                  className="cursor-pointer items-start"
                  asChild
                >
                  <Link
                    to={ROUTES.newSession + "?patientId=" + session.patientId}
                  >
                    <CalendarClock className="mt-1" />
                    <span>Programmer d'autres séances identiques</span>
                  </Link>
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem
                  className="cursor-pointer items-start"
                  onClick={onDuplicate}
                  asChild
                >
                  <Link
                    to={
                      ROUTES.newSession +
                      "?sessionProgram=" +
                      session?.sessionProgram?._id
                    }
                  >
                    <PlusSquare className="mt-1" />
                    <span>Nouvelle séance avec ce modèle</span>
                  </Link>
                </DropdownMenuItem> */}

                <DropdownMenuItem
                  className="cursor-pointer hover:text-red-500 items-start"
                  disabled={deleteWorkoutSession.isPending}
                  onClick={() => {
                    confirmDeleteModal.onOpen();
                  }}
                >
                  {deleteWorkoutSession.isPending ? (
                    <LoaderCircle className="size-4 animate-spin mt-1" />
                  ) : (
                    <Trash2Icon className="size-4 text-red-500 mt-1" />
                  )}
                  <span className="text-red-500">Supprimer</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <MrsConfirmationModal
        {...confirmDeleteModal}
        onContinue={() => {
          deleteWorkoutSession.mutate({
            param: { id: workoutSessionId },
          });
        }}
        title="Supprimer la séance"
        description="Voulez-vous vraiment supprimer cette séance ? Cette action est irréversible."
        onContinueLoading={deleteWorkoutSession.isPending}
      />
      <div className="text-sm flex flex-row items-start gap-2 w-full text-muted-foreground">
        {/* {EXOS.map(
          (exercise, index) =>
            (index > 0 ? ", " : " ") + (exercise.exerciseId as any)?.title
        )} */}
      </div>
    </button>
  );
};
