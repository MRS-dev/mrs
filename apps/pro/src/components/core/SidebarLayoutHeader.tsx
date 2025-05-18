"use client";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Sidebar as SidebarIcon } from "lucide-react";
import useSidebarStore from "./Sidebar/Sidebar.store";
import { useRouter } from "next/navigation";
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
  const { isOpen, toggle } = useSidebarStore();
  // const { toast } = useToast();
  const router = useRouter();
  // const { notifications, markAsRead, addNotification } = useNotificationContext();
  // const hasUnreadNotifications = notifications.some((notification) => !notification.isRead);

  // useEffect(() => {
  //   socket.on("newNotification", (notification: any) => {
  //     console.log("NEW NOTIFICATION: ", notification)
  //     addNotification(notification)
  //     toast({
  //       title: "Nouvelle Notification",
  //       description: notification.content,
  //       variant: "default",
  //     });
  //   });
  //   return () => {
  //     socket.off("newNotification");
  //   };
  // }, []);

  // const handleNotificationClick = (notification: any) => {

  //   markAsRead(notification.id)
  //   switch (notification.type) {
  //     case "new_doctor_request":
  //       router.push(`/registration-requests`); // Par exemple, aller vers un chat spécifique
  //       break;
  //     default:
  //       console.warn("Type de notification inconnu :", notification.type);
  //       break;
  //   }
  //TODO Handle go to en fonction du type de la notif
  // }

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
            {/* <div className="ml-auto">
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
                    <DropdownMenuItem>Pas de nouvelles notifications</DropdownMenuItem>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex justify-between items-center"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <span>{notification.content}</span>
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
                    className="text-center text-sm text-muted-foreground"
                  >
                    Marquer tout comme lu
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}
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
