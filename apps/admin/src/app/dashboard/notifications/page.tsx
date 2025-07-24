"use client";

import React, { useMemo, useState } from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Circle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  User,
  Filter
} from "lucide-react";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import GridLayout from "@/components/mrs/GridLayout";
import { useNotifications, useMarkAsRead } from "@/queries/notifications";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  isPersonallyRead: boolean;
}

// Types de notifications avec leurs configurations visuelles
const NOTIFICATION_TYPES = {
  admin_alert: { 
    label: "Alerte Admin", 
    icon: AlertCircle, 
    color: "bg-red-100 text-red-800 border-red-200" 
  },
  new_doctor_request: { 
    label: "Demande Médecin", 
    icon: User, 
    color: "bg-blue-100 text-blue-800 border-blue-200" 
  },
  new_message: { 
    label: "Nouveau Message", 
    icon: MessageSquare, 
    color: "bg-green-100 text-green-800 border-green-200" 
  },
  system: { 
    label: "Système", 
    icon: Bell, 
    color: "bg-gray-100 text-gray-800 border-gray-200" 
  },
  general: { 
    label: "Général", 
    icon: Bell, 
    color: "bg-purple-100 text-purple-800 border-purple-200" 
  },
};

export default function Notifications() {
  const notificationsQuery = useNotifications();
  const markAsRead = useMarkAsRead();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");

  const notifications = useMemo(() => {
    const allNotifications = notificationsQuery?.data?.pages.flatMap((page) => page.items) || [];
    
    // Filtrer par type
    let filtered = selectedTypes.length > 0 
      ? allNotifications.filter((notif: Notification) => selectedTypes.includes(notif.type))
      : allNotifications;
    
    // Filtrer par statut lu/non lu
    if (statusFilter === "unread") {
      filtered = filtered.filter((notif: Notification) => !notif.isPersonallyRead);
    } else if (statusFilter === "read") {
      filtered = filtered.filter((notif: Notification) => notif.isPersonallyRead);
    }
    
    return filtered;
  }, [notificationsQuery.data, selectedTypes, statusFilter]);

  const unreadCount = useMemo(() => {
    const allNotifications = notificationsQuery?.data?.pages.flatMap((page) => page.items) || [];
    return allNotifications.filter((notif: Notification) => !notif.isPersonallyRead).length;
  }, [notificationsQuery.data]);

  const handleMarkAsRead = (notificationIds: string[]) => {
    markAsRead.mutate({ notificationIds });
  };

  const handleMarkAllAsRead = () => {
    markAsRead.mutate({ markAllAsRead: true });
  };

  const getNotificationTypeConfig = (type: string) => {
    return NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES] || NOTIFICATION_TYPES.general;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "À l'instant";
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      return "Hier";
    } else {
      return format(date, "dd MMM", { locale: fr });
    }
  };

  return (
    <SidebarLayout
      Header={
        <SidebarLayoutHeader>
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-row items-center space-x-3">
              {/* Filtre par type */}
              <Select
                value={selectedTypes.length > 0 ? selectedTypes.join(",") : "all"}
                onValueChange={(value) => setSelectedTypes(value === "all" ? [] : value.split(","))}
              >
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {Object.entries(NOTIFICATION_TYPES).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtre par statut */}
              <Select value={statusFilter} onValueChange={(value: "all" | "unread" | "read") => setStatusFilter(value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="unread">Non lues</SelectItem>
                  <SelectItem value="read">Lues</SelectItem>
                </SelectContent>
              </Select>

              {/* Bouton marquer tout comme lu */}
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleMarkAllAsRead}
                  disabled={markAsRead.isPending}
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Tout marquer lu
                </Button>
              )}
            </div>
          </div>
        </SidebarLayoutHeader>
      }
    >
      <div className="h-full flex-1 p-6 xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md mx-auto w-full">
        <GridLayout
          items={notifications}
          renderGridItem={(notification: Notification) => {
            const typeConfig = getNotificationTypeConfig(notification.type);
            const IconComponent = typeConfig.icon;
            
            return (
              <div
                key={notification.id}
                className={`bg-background rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  !notification.isPersonallyRead ? "ring-2 ring-blue-100 border-blue-200" : ""
                }`}
                onClick={() => {
                  if (!notification.isPersonallyRead) {
                    handleMarkAsRead([notification.id]);
                  }
                }}
              >
                <div className="p-4 flex gap-4">
                  {/* Indicateur de statut et icône */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="relative">
                      <IconComponent className="w-6 h-6 text-muted-foreground" />
                      {!notification.isPersonallyRead && (
                        <Circle className="w-3 h-3 text-blue-500 fill-blue-500 absolute -top-1 -right-1" />
                      )}
                    </div>
                  </div>

                  {/* Contenu de la notification */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold line-clamp-1 ${
                          !notification.isPersonallyRead ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {notification.title}
                        </h3>
                        <Badge variant="outline" className={`text-xs ${typeConfig.color}`}>
                          {typeConfig.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0 ml-4">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(notification.createdAt)}
                      </div>
                    </div>

                    <p className={`text-sm line-clamp-2 mb-3 ${
                      !notification.isPersonallyRead ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {notification.content}
                    </p>

                    {/* Actions rapides */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </span>
                      
                      {!notification.isPersonallyRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead([notification.id]);
                          }}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Marquer lu
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
          keyExtractor={(notification: Notification) => notification.id}
          isLoading={notificationsQuery.isLoading}
          hasMore={notificationsQuery.hasNextPage}
          onLoadMore={() => notificationsQuery.fetchNextPage()}
          isLoadingMore={notificationsQuery.isFetchingNextPage}
          error={notificationsQuery.error?.message}
          emptyMessage="Aucune notification trouvée"
          skeletonCount={6}
        />
      </div>
    </SidebarLayout>
  );
}