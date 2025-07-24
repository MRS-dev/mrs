"use client";
import React from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, User, Calendar, Activity } from "lucide-react";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { MrsQuery } from "@/components/mrs/MrsQuery";
import { useActivities } from "@/queries/activities/useActivities";
import { useUser } from "@/queries/user/useUser";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

interface ActivityType {
  id: string;
  title: string;
  description: string;
  authorId: string | null;
  createdAt: string;
}

const Activities: React.FC = () => {
  const activitiesQuery = useActivities({
    page: 1,
    limit: 100,
  });
  
  const userQuery = useUser();

  return (
    <SidebarLayout
      Header={
        <SidebarLayoutHeader>
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
            <h1 className="text-2xl font-bold">
              Activités
              <span className="text-muted-foreground font-medium text-2xl ml-2">
                ({activitiesQuery.data?.items?.length || 0})
              </span>
            </h1>
          </div>
        </SidebarLayoutHeader>
      }
    >
      <div className="flex flex-1 flex-col gap-4 p-4 text-foreground">
        <MrsQuery
          query={activitiesQuery}
          Data={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activitiesQuery.data?.items.map((activity: ActivityType) => (
                <Link 
                  key={activity.id}
                  href={`/dashboard/activities/${activity.id}`}
                  className="bg-background rounded-xl border shadow-sm p-4 hover:shadow-md cursor-pointer w-full overflow-hidden group relative block"
                >
                  <div className="flex flex-row items-start gap-3">
                    <div className="w-16 min-w-16 aspect-square rounded-xl bg-muted flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex flex-row items-start justify-between w-full mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold truncate">
                            {activity.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {activity.authorId && activity.authorId === userQuery.data?.data?.user?.id && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                <User className="w-3 h-3 mr-1" />
                                Créé par moi
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {activity.createdAt && format(new Date(activity.createdAt), "dd MMM yyyy", { locale: fr })}
                        </div>
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
  );
};

export default Activities;
