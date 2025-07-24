"use client";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Sidebar as SidebarIcon, Bell } from "lucide-react";
import useSidebarStore from "./Sidebar/Sidebar.store";
import { useNotifications } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import type { Notification } from "@mrs/socket-client";
interface SidebarLayoutProps {
  Header?: React.ReactNode;
  Footer?: React.ReactNode;
  children?: React.ReactNode;
}
const SidebarLayoutHeader = ({
  Header,
  Footer,
  children,
}: SidebarLayoutProps) => {
  const { toggle } = useSidebarStore();
  const router = useRouter();
  const { notifications, markAsRead, hasUnreadNotifications } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case "new_message":
        router.push(`/dashboard/chats`);
        break;
      case "new_patient":
        router.push(`/dashboard/patients`);
        break;
      case "session_reminder":
        router.push(`/dashboard/sessions`);
        break;
      default:
        console.warn("Type de notification inconnu :", notification.type);
        break;
    }
  };

  return (
    <>
      {Header}
      <div className="flex flex-col sticky top-0 z-10  border-b bg-background/40 backdrop-blur-md">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-all ease-linear  ">
          <div className="flex items-center gap-2 px-4 w-full">
            <Button
              className="-ml-1"
              size="icon"
              variant="ghost"
              onClick={() => toggle()}
            >
              <SidebarIcon />
            </Button>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Notifications">
                    <div className="relative">
                      <Bell />
                      {hasUnreadNotifications && (
                        <span className="absolute top-0 right-0 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <DropdownMenuItem disabled>
                      Pas de nouvelles notifications
                    </DropdownMenuItem>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-sm">
                            {notification.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {notification.content}
                          </span>
                        </div>
                        {!notification.isRead && (
                          <span className="ml-2 rounded-full bg-blue-500 text-white text-xs px-2 py-1">
                            Nouveau
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))
                  )}
                  {notifications.length > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() => markAsRead("all")}
                    className="text-center text-sm text-muted-foreground cursor-pointer"
                  >
                    Marquer tout comme lu
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator orientation="vertical" className="mr-2 h-4" />
            {children}
          </div>
        </header>
        {Footer}
      </div>
    </>
  );
};

export default SidebarLayoutHeader;
