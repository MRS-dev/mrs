"use client";
import React, { useMemo, useState } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Info, Trash2, Eye, EyeOff, Tag, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { useModal } from "@/hooks/useModale";
import GridLayout from "@/components/mrs/GridLayout";
import { useExercises } from "@/queries/exercises/useExercises";
import { useDeleteExercise } from "@/queries/exercises/useDeleteExercise";
import { useUpdateExercise } from "@/queries/exercises/useUpdateExercise";
import { CreateExerciseModal } from "@/components/modals/ExerciseModal";
import ExerciseViewModal from "@/components/modals/ExerciseViewModal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Exercise {
  id: string;
  title: string;
  description: string;
  photoUrl?: string | null;
  videoUrl?: string | null;
  authorId?: string | null;
  authorType?: "admin" | "doctor" | null;
  tags?: string[] | null;
  public?: boolean | null;
  createdAt: string;
}

export default function Exercises() {
  const exercisesQuery = useExercises();
  const deleteExercise = useDeleteExercise();
  const updateExercise = useUpdateExercise();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const exercises = useMemo(() => {
    return exercisesQuery?.data?.pages.flatMap((page) => page.items);
  }, [exercisesQuery.data]);

  const createExerciseModal = useModal();

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedExercise(null);
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      await deleteExercise.mutateAsync(exerciseId);
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const handleQuickDelete = (e: React.MouseEvent, exerciseId: string) => {
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?")) {
      handleDeleteExercise(exerciseId);
    }
  };

  const handleUpdateVisibility = async (exerciseId: string, isPublic: boolean) => {
    try {
      await updateExercise.mutateAsync({
        exerciseId,
        data: { public: isPublic }
      });
    } catch (error) {
      console.error("Error updating exercise visibility:", error);
    }
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
                    onClick={() => importActivitiesModal.open()}
                  >
                    <span>Importer</span>
                  </Button> */}
                  <Button onClick={createExerciseModal.onOpen}>
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
            items={exercises || []}
            renderGridItem={(exercise) => (
              <div
                onClick={() => handleExerciseClick(exercise)}
                key={exercise.id}
                className="bg-background rounded-xl border shadow-sm hover:shadow-md cursor-pointer w-full overflow-hidden group"
              >
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-14 min-w-14 aspect-square rounded-xl bg-muted flex items-center justify-center">
                      {exercise.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={exercise.photoUrl} 
                          alt={exercise.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-muted-foreground/20 rounded"></div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-semibold truncate">
                          {exercise.title}
                        </h3>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExerciseClick(exercise);
                            }}
                          >
                            <Info className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => handleQuickDelete(e, exercise.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {exercise.public ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Privé
                          </Badge>
                        )}
                        {exercise.tags && exercise.tags.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {exercise.tags[0]}
                            {exercise.tags.length > 1 && <span className="ml-1">+{exercise.tags.length - 1}</span>}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {exercise.description}
                    </p>
                    
                    {exercise.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Créé le {format(new Date(exercise.createdAt), "dd/MM/yyyy", { locale: fr })}
                        </span>
                      </div>
                    )}
                    
                    {exercise.authorId && (
                      <div className="flex items-center gap-2">
                        <User className="size-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Auteur: {exercise.authorId.slice(-8)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            keyExtractor={(exercise) => exercise.id}
            isLoading={exercisesQuery.isLoading}
            hasMore={exercisesQuery.hasNextPage}
            onLoadMore={() => exercisesQuery.fetchNextPage()}
            isLoadingMore={exercisesQuery.isFetchingNextPage}
          />
        </div>
      </SidebarLayout>

      <CreateExerciseModal {...createExerciseModal} />
      
      <ExerciseViewModal
        exercise={selectedExercise}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        onDelete={handleDeleteExercise}
        onUpdateVisibility={handleUpdateVisibility}
      />
    </>
  );
}
