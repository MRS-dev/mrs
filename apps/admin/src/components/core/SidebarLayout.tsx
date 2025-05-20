"use client";
import Sidebar from "./Sidebar/Sidebar";
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  children?: React.ReactNode;
  Header?: React.ReactNode;
  scrollable?: boolean;
  className?: string;
}
const SidebarLayout = ({
  children,
  Header,
  scrollable = true,
  className,
}: SidebarLayoutProps) => {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-row text-foreground",
        className
      )}
    >
      <Sidebar />
      {/* <AppSidebar /> */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          scrollable ? "" : "overflow-hidden"
        )}
      >
        {Header}
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
