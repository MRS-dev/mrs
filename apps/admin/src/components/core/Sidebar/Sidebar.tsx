"use client";
import { cn } from "@/lib/utils";
import {
  Bell,
  BicepsFlexed,
  ChevronsUpDown,
  Contact,
  LoaderCircle,
  LogOut,
  MessageSquare,
  Shield,
  Smile,
  UserPlus,
  Users,
  Waypoints,
  TvMinimalPlay,
} from "lucide-react";
import useSidebarStore from "./Sidebar.store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ROUTES } from "@/routes";
import { usePathname, useRouter } from "next/navigation";
import { useSignOut } from "@/queries/auth/useSignOut";
import { useUser } from "@/queries/user/useUser";
import { MrsAvatar } from "@/components/mrs/MrsAvatar";
import Image from "next/image";

const SIDEBAR_MAX_WIDTH = "max-w-72";
const SidebarHeader = () => {
  const { isOpen } = useSidebarStore();
  return (
    <Link
      href="/"
      className={cn(
        "mt-3 h-12 w-full flex items-center justify-center rounded-xl text-muted-foreground  hover:text-primary overflow-hidden"
      )}
    >
      <div className="w-12 h-12 min-w-12 flex items-center justify-center">
        <Image
          src="/logo-monochrome.png"
          alt="logo"
          className="w-10 h-10 min-w-10"
          width={40}
          height={40}
        />
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
          <span className="text-primary/50">Santé</span>
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
  return (
    <div className="flex flex-col  flex-1 justify-start pt-3 overflow-y-auto">
      <SidebarLink to={ROUTES.admins} Icon={<Shield />} label="Admins" />
      <SidebarLink to={ROUTES.pros} Icon={<Users />} label="Kinés" />
      <SidebarLink
        to={ROUTES.registrationRequests}
        Icon={<UserPlus />}
        label="Demande de kinés"
      />
      <SidebarLink to={ROUTES.patients} Icon={<Contact />} label="Patients" />
      <SidebarLink
        to={ROUTES.exercises}
        Icon={<BicepsFlexed />}
        label="Exercices"
      />
      <SidebarLink
        to={ROUTES.workoutTemplates}
        Icon={<Waypoints />}
        label="Programmes"
      />
      <SidebarLink to={ROUTES.activities} Icon={<Smile />} label="Activités" />
      <SidebarLink
        to={ROUTES.chats}
        Icon={<MessageSquare />}
        label="Messagerie"
      />
      <SidebarLink
        to={ROUTES.ads}
        Icon={<TvMinimalPlay />}
        label="Publicités"
      />
      <SidebarLink
        to={ROUTES.notifications}
        Icon={<Bell />}
        label="Notifications"
      />
    </div>
  );
};
const SidebarFooter = () => {
  const { isOpen } = useSidebarStore();
  const router = useRouter();
  const { data } = useUser();
  const signOut = useSignOut({
    onSuccess: () => router.push(ROUTES.login),
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
  const { isOpen } = useSidebarStore();
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
