import { cn } from "@/lib/utils";
import {
  BicepsFlexed,
  ChevronsUpDown,
  LoaderCircle,
  LogOut,
  MessageCircleQuestion,
  MessageCircleReply,
  MessageSquare,
  Smile,
  User,
  Users,
  Waypoints,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSidebarStore from "./Sidebar.store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ROUTES } from "@/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/queries/user/useUser";
import { useSignOut } from "@/queries/auth/useSignOut";
import { MrsAvatar } from "@/components/mrs/MrsAvatar";
const SIDEBAR_MAX_WIDTH = "max-w-72";
const SidebarHeader = () => {
  const { isOpen } = useSidebarStore();
  return (
    <Link
      href={ROUTES.home}
      className={cn(
        "mt-3 h-12 w-full flex items-center justify-center rounded-xl text-muted-foreground  hover:text-primary overflow-hidden"
      )}
    >
      <div className="w-12 h-12 min-w-12 flex items-center justify-center">
        <img src="/logo.png" alt="logo" className="w-10 h-10 min-w-10" />
      </div>
      <div
        className={cn(
          "max-w-flex flex-1 transition-all duration-300 text-foreground font-bold text-base",
          isOpen ? `${SIDEBAR_MAX_WIDTH} opacity-100` : "max-w-0 opacity-0"
        )}
      >
        <span className="text-lg truncate">
          <span className="text-foreground">Ma</span>{" "}
          <span className="text-primary">Routine</span>{" "}
          <span className="text-primary/60">Santé</span>
        </span>
      </div>
    </Link>
  );
};
interface SidebarLinkProps {
  to: string;
  Icon: React.ReactNode;
  label: string;
}
const SidebarLink = ({ to, Icon, label }: SidebarLinkProps) => {
  const { isOpen } = useSidebarStore();
  const isActive = usePathname().startsWith(to);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={to}
            className={cn(
              "h-12 w-full flex items-center justify-start rounded-xl transition-all duration-300",
              isActive
                ? "text-primary bg-primary/10 "
                : " text-muted-foreground hover:bg-primary/10 hover:text-primary",
              isOpen ? SIDEBAR_MAX_WIDTH : "max-w-12"
            )}
          >
            <div className="w-12 h-12 flex items-center justify-center">
              {Icon}
            </div>
            <div
              className={cn(
                "max-w-flex flex-1 transition-all duration-300",
                isOpen
                  ? `${SIDEBAR_MAX_WIDTH} opacity-100`
                  : "max-w-0 opacity-0"
              )}
            >
              <span>{label}</span>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <span>{label}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
const SidebarContent = () => {
  const { isOpen } = useSidebarStore();
  const [ad, setAd] = useState(null as any);

  const adQuery = useQuery({
    queryKey: ["ad-enable"],
    queryFn: () =>
      Promise.resolve({
        _id: "1",
        photoUrl: "/logo.png",
        url: "https://www.google.com",
      }), //getEnableAd(),
    enabled: true,
  });

  useEffect(() => {
    if (adQuery.data) {
      setAd(adQuery.data);
      logAdEvent("view", adQuery.data._id);
    }
  }, [adQuery.data]);

  const handleClick = () => {
    if (ad?.url) {
      window.open(ad.url, "_blank", "noopener,noreferrer");
      logAdEvent("click", ad?._id);
    }
  };

  const logAdEvent = (type: "view" | "click", adId: any) => {
    // createAdEvent({ type, adId });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col  flex-1 justify-start pt-3 items-center overflow-y-auto">
        <SidebarLink to={ROUTES.patients} Icon={<Users />} label="Patients" />

        <SidebarLink
          to={ROUTES.programTemplates}
          Icon={<Waypoints />}
          label="Modèle de programme"
        />
        <SidebarLink
          to={ROUTES.exercises}
          Icon={<BicepsFlexed />}
          label="Exercices"
        />
        <SidebarLink
          to={ROUTES.activities}
          Icon={<Smile />}
          label="Activités"
        />
        <SidebarLink
          to={ROUTES.chats}
          Icon={<MessageSquare />}
          label="Messagerie"
        />
      </div>
      <div className="flex flex-col items-center">
        <SidebarLink
          to={ROUTES.chats}
          Icon={<MessageCircleQuestion />}
          label="Support"
        />
        <SidebarLink
          to={ROUTES.chats}
          Icon={<MessageCircleReply />}
          label="Feedback"
        />
      </div>
      {isOpen && (
        <div
          className="w-full aspect-video bg-primary/10 rounded-xl relative overflow-hidden mt-3 max-w-full cursor-pointer"
          style={
            ad
              ? {
                  backgroundImage: `url(${ad.photoUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { backgroundColor: "var(--color-primary-10)" }
          }
          onClick={handleClick}
        >
          <div className="bg-white/90 px-2 py-1 text-xs text-primary font-semibold absolute top-0 right-0 rounded-bl-xl rounded-tr-xl">
            Publicité
          </div>
        </div>
      )}
    </div>
  );
};
const SidebarFooter = () => {
  const { isOpen } = useSidebarStore();
  const router = useRouter();
  const { data } = useUser();
  const signOut = useSignOut({
    onSuccess: () => router.push(ROUTES.signIn),
  });
  const displayName = data?.data?.user?.name + " " + data?.data?.user?.lastName;
  const email = data?.data?.user?.email;
  return (
    <div className="flex flex-col mb-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "rounded-xl flex flex-row items-center justify-center p-3 mb-5 space-x-2 mt-2 transition-all duration-300 text-muted-foreground ",
              isOpen
                ? "border p-3 space-x-2 hover:bg-primary/10 hover:text-primary"
                : "p-0 space-x-0"
            )}
          >
            <MrsAvatar
              size={40}
              className="size-10"
              displayName={displayName}
              src={data?.data?.user?.image || ""}
              alt={""}
            />
            <div
              className={cn(
                "flex flex-row items-center justify-between w-full transition-all duration-300",
                isOpen
                  ? `${SIDEBAR_MAX_WIDTH} opacity-100`
                  : "max-w-0 opacity-0"
              )}
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl"
          side="right"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <MrsAvatar
                size={32}
                className="size-8"
                displayName={displayName}
                src={data?.data?.user?.image || ""}
                alt={""}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="rounded-md cursor-pointer">
            <Link href={ROUTES.account}>
              <User className="size-4" />
              Mon compte
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut.mutate()}
            className="rounded-md cursor-pointer hover:bg-red-50 text-red-500 active:bg-red-50 focus:bg-red-50 active:text-red-500  focus:text-red-500"
            disabled={signOut.isPending}
          >
            <LogOut className="size-4" />
            Se déconnecter
            {signOut.isPending && (
              <LoaderCircle className="size-4 ml-2 animate-spin" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();
  return (
    <div
      className={cn(
        "bg-muted/50 border-r flex flex-col px-3 w-full transition-all duration-300 h-screen sticky top-0 z-20",
        isOpen ? SIDEBAR_MAX_WIDTH : "max-w-20"
      )}
    >
      <SidebarHeader />
      <SidebarContent />

      <SidebarFooter />
    </div>
  );
}
export default Sidebar;
