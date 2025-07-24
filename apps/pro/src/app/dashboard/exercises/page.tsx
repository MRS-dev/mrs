"use client";
import React, { useState, useMemo } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Plus,
  Search,
  Trash2,
  User,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { useExercises } from "@/queries/exercises/useExercises";
import { useDeleteExercise } from "@/queries/exercises/useDeleteExercise";
import { MrsQuery } from "@/components/mrs/MrsQuery";
import { useModal } from "@/hooks/useModale";
import CreateExerciseModal from "@/components/modals/CreateExerciseModal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useUser } from "@/queries/user/useUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ExerciseType {
  id: string;
  title: string;
  description: string;
  authorId: string | null;
  authorType: "admin" | "doctor" | null;
  createdAt: string;
  photoUrl?: string | null;
  public: boolean | null;
  tags?: string[] | null;
}

const Exercises: React.FC = () => {
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<ExerciseType | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const userQuery = useUser();
  const exercisesQuery = useExercises({
    page: 1,
    limit: 100, // Augmenté pour avoir plus d'exercices à filtrer
  });

  const deleteExercise = useDeleteExercise({
    onSuccess: () => {
      toast.success("Exercice supprimé avec succès!");
      setIsDeleteModalOpen(false);
      setExerciseToDelete(null);
      exercisesQuery.refetch();
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description:
          error.message ||
          "Une erreur s'est produite lors de la suppression de l'exercice.",
      });
    },
  });

  const createExerciseModal = useModal();

  // Filtrer les exercices si nécessaire
  const filteredExercises = useMemo(() => {
    if (!exercisesQuery.data?.items) return [];

    if (showOnlyMine && userQuery.data?.data?.user?.id) {
      return exercisesQuery.data.items.filter(
        (exercise: ExerciseType) =>
          exercise.authorId &&
          exercise.authorId === userQuery.data?.data?.user?.id
      );
    }

    return exercisesQuery.data.items;
  }, [
    exercisesQuery.data?.items,
    showOnlyMine,
    userQuery.data?.data?.user?.id,
  ]);

  const handleDeleteClick = (e: React.MouseEvent, exercise: ExerciseType) => {
    e.preventDefault();
    e.stopPropagation();
    setExerciseToDelete(exercise);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("toto");
    if (exerciseToDelete) {
      deleteExercise.mutate({ param: { id: exerciseToDelete.id } });
    }
  };

  const isUserOwner = (exercise: ExerciseType) => {
    return (
      exercise.authorId && exercise.authorId === userQuery.data?.data?.user?.id
    );
  };
  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <h1 className="text-2xl font-bold">
                Exercices
                <span className="text-muted-foreground font-medium text-2xl ml-2">
                  ({filteredExercises.length})
                </span>
              </h1>
              <div className="flex flex-row items-center space-x-3">
                <Button
                  variant={showOnlyMine ? "default" : "outline"}
                  onClick={() => setShowOnlyMine(!showOnlyMine)}
                  className="text-sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  {showOnlyMine ? "Tous les exercices" : "Mes exercices"}
                </Button>
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
                {filteredExercises.map((exercise: ExerciseType) => (
                  <Link
                    key={exercise.id}
                    href={`/dashboard/exercises/${exercise.id}`}
                    className="bg-background rounded-xl border shadow-sm p-4 hover:shadow-md cursor-pointer w-full overflow-hidden group relative block"
                  >
                    <div className="flex flex-row items-start gap-3">
                      <div className="w-16 min-w-16 aspect-square rounded-xl bg-muted flex items-center justify-center">
                        {exercise.photoUrl ? (
                          <Image
                            src={exercise.photoUrl}
                            alt={exercise.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {exercise.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex flex-row items-start justify-between w-full mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold truncate">
                              {exercise.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {exercise.authorType === "admin" && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  Exercice Admin
                                </Badge>
                              )}
                              {exercise.authorId &&
                                exercise.authorId ===
                                  userQuery.data?.data?.user?.id && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    <User className="w-3 h-3 mr-1" />
                                    Créé par moi
                                  </Badge>
                                )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 ml-2">
                            {exercise.authorId &&
                              exercise.authorId ===
                                userQuery.data?.data?.user?.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) =>
                                    handleDeleteClick(e, exercise)
                                  }
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              )}
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {exercise.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {exercise.createdAt &&
                              format(
                                new Date(exercise.createdAt),
                                "dd MMM yyyy",
                                { locale: fr }
                              )}
                          </div>
                          {exercise.tags && exercise.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="bg-muted px-2 py-1 rounded text-xs">
                                {exercise.tags[0]}
                              </span>
                              {exercise.tags.length > 1 && (
                                <span className="text-muted-foreground">
                                  +{exercise.tags.length - 1}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            }
          />
        </div>
      </SidebarLayout>

      <CreateExerciseModal {...createExerciseModal} />

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle>Supprimer l&apos;exercice</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer l&apos;exercice{" "}
              <span className="font-semibold text-foreground">
                {exerciseToDelete?.title}
              </span>{" "}
              ? Cette action supprimera définitivement l&apos;exercice et toutes
              ses données associées.
            </p>
            {exerciseToDelete && !isUserOwner(exerciseToDelete) && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ Vous n&apos;êtes pas propriétaire de cet exercice. La
                  suppression pourrait échouer.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteExercise.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteExercise.isPending}
            >
              {deleteExercise.isPending
                ? "Suppression..."
                : "Supprimer définitivement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Exercises;
