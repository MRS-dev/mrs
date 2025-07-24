"use client";

import React from "react";
import { useParams } from "next/navigation";
import SidebarLayout from "@/components/core/SidebarLayout";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Activity as ActivityIcon
} from "lucide-react";
import { useActivity } from "@/queries/activities/useActivity";
import { useUser } from "@/queries/user/useUser";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

const ActivityDetails: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  
  const activityQuery = useActivity(activityId);
  const userQuery = useUser();

  const activity = activityQuery.data?.[0]; // L'API retourne un array
  const isOwner = activity?.authorId && activity.authorId === userQuery.data?.data?.user?.id;

  if (activityQuery.isLoading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SidebarLayout>
    );
  }

  if (activityQuery.error || !activity) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <h2 className="text-xl font-semibold">Activité non trouvée</h2>
          <Button asChild>
            <Link href="/dashboard/activities">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux activités
            </Link>
          </Button>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout
      Header={
        <SidebarLayoutHeader>
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/activities">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold truncate">{activity.title}</h1>
            </div>
          </div>
        </SidebarLayoutHeader>
      }
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* En-tête avec icône et infos principales */}
        <div className="bg-background rounded-xl border shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Icône */}
            <div className="w-full md:w-32 aspect-square rounded-xl bg-muted flex items-center justify-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <ActivityIcon className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Informations */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
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
                  Créé le {format(new Date(activity.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-background rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {activity.description}
          </p>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-background rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Informations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">ID de l&apos;activité</label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {activity.id}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date de création</label>
              <p className="text-sm">
                {format(new Date(activity.createdAt), "PPPp", { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ActivityDetails;