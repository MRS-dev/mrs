"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Calendar, 
  Eye,
  EyeOff,
  Tag,
  Trash2,
  Image,
  X,
  Maximize2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Exercise {
  id: string;
  title: string;
  description: string;
  photoUrl?: string | null;
  videoUrl?: string | null;
  authorId?: string | null;
  tags?: string[] | null;
  public?: boolean | null;
  createdAt: string;
}

interface ExerciseViewModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (exerciseId: string) => void;
  onUpdateVisibility?: (exerciseId: string, isPublic: boolean) => void;
}

const InfoRow = ({ 
  icon: Icon, 
  label, 
  value, 
  className 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | null | undefined;
  className?: string;
}) => {
  if (!value) return null;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-muted-foreground">{label}:</span>
        <span className="ml-2 text-sm">{value}</span>
      </div>
    </div>
  );
};

export const ExerciseViewModal: React.FC<ExerciseViewModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onDelete,
  onUpdateVisibility,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);

  // Initialiser l'état de visibilité quand l'exercice change
  React.useEffect(() => {
    if (exercise) {
      setIsPublic(exercise.public ?? false);
    }
  }, [exercise]);

  if (!exercise) return null;

  const formattedDate = exercise.createdAt
    ? format(new Date(exercise.createdAt), "dd MMMM yyyy à HH:mm", { locale: fr })
    : null;

  const handleDelete = () => {
    if (onDelete && confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?")) {
      onDelete(exercise.id);
      onClose();
    }
  };

  const handleVisibilityToggle = () => {
    const newVisibility = !isPublic;
    setIsPublic(newVisibility);
    if (onUpdateVisibility) {
      onUpdateVisibility(exercise.id, newVisibility);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
              {exercise.photoUrl ? (
                <img 
                  src={exercise.photoUrl} 
                  alt={exercise.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Image className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold mb-2">
                {exercise.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isPublic}
                    onCheckedChange={handleVisibilityToggle}
                  />
                  <Badge variant="outline" className={isPublic ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}>
                    {isPublic ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                    {isPublic ? "Public" : "Privé"}
                  </Badge>
                </div>
                {exercise.tags && exercise.tags.length > 0 && (
                  <div className="flex gap-1">
                    {exercise.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Description
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* Médias */}
          {(exercise.photoUrl || exercise.videoUrl) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Médias
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exercise.photoUrl && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">Photo</p>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={exercise.photoUrl} 
                          alt={`Photo de ${exercise.title}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => setSelectedImage(exercise.photoUrl || null)}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedImage(exercise.photoUrl || null)}
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {exercise.videoUrl && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">Vidéo</p>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <video 
                          src={exercise.videoUrl} 
                          controls
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Informations système */}
          <Separator />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Informations système
            </h3>
            <div className="space-y-3">
              <InfoRow
                icon={Calendar}
                label="Créé le"
                value={formattedDate}
              />
              <InfoRow
                icon={User}
                label="ID Auteur"
                value={exercise.authorId}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="mr-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Modal de prévisualisation d'image */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 z-10 h-8 w-8 p-0"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Aperçu en plein écran"
                className="w-full h-full object-contain rounded-lg"
                style={{ maxHeight: '90vh' }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default ExerciseViewModal;