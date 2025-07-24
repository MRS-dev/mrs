"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "@/components/core/SidebarLayout";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  Tag,
  Play,
  Image as ImageIcon
} from "lucide-react";
import { useExercise } from "@/queries/exercises/useExercise";
import { useDeleteExercise } from "@/queries/exercises/useDeleteExercise";
import { useUser } from "@/queries/user/useUser";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ExerciseDetails: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const exerciseQuery = useExercise(exerciseId);
  const userQuery = useUser();
  
  const deleteExercise = useDeleteExercise({
    onSuccess: () => {
      toast.success("Exercice supprimé avec succès!");
      router.push("/dashboard/exercises");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description: error.message || "Une erreur s'est produite lors de la suppression de l'exercice.",
      });
    },
  });

  const exercise = exerciseQuery.data;
  const isOwner = exercise?.authorId && exercise.authorId === userQuery.data?.data?.user?.id;

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (exercise) {
      deleteExercise.mutate({ param: { id: exercise.id } });
    }
  };

  if (exerciseQuery.isLoading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SidebarLayout>
    );
  }

  if (exerciseQuery.error || !exercise) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <h2 className="text-xl font-semibold">Exercice non trouvé</h2>
          <Button asChild>
            <Link href="/dashboard/exercises">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux exercices
            </Link>
          </Button>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <>
      <SidebarLayout
        Header={
          <SidebarLayoutHeader>
            <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/exercises">
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold truncate">{exercise.title}</h1>
              </div>
              
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDeleteClick}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          </SidebarLayoutHeader>
        }
      >
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* En-tête avec image et infos principales */}
          <div className="bg-background rounded-xl border shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image ou placeholder */}
              <div className="w-full md:w-80 aspect-video rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                {exercise.photoUrl ? (
                  <Image 
                    src={exercise.photoUrl} 
                    alt={exercise.title}
                    width={320}
                    height={180}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span className="text-sm">Aucune image</span>
                  </div>
                )}
              </div>

              {/* Informations */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {exercise.authorType === "admin" && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Exercice Admin
                    </Badge>
                  )}
                  {isOwner && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <User className="w-3 h-3 mr-1" />
                      Créé par moi
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Créé le {format(new Date(exercise.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </div>

                  {exercise.tags && exercise.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-2">
                        {exercise.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-background rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {exercise.description}
            </p>
          </div>

          {/* Vidéo si disponible */}
          {exercise.videoUrl && (
            <div className="bg-background rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Vidéo de démonstration
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <video 
                  src={exercise.videoUrl} 
                  controls 
                  className="w-full h-full"
                  poster={exercise.photoUrl || undefined}
                >
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              </div>
            </div>
          )}
        </div>
      </SidebarLayout>

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
                {exercise?.title}
              </span>{" "}
              ? Cette action supprimera définitivement l&apos;exercice et toutes ses données associées.
            </p>
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
              {deleteExercise.isPending ? "Suppression..." : "Supprimer définitivement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExerciseDetails;