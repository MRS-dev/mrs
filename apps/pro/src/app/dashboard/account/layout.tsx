"use client";
import React from "react";
import SidebarLayout from "@/components/core/SidebarLayout";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { ROUTES } from "@/routes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface AccountLayoutProps {
  children: React.ReactNode;
}
const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isInformations = pathname === ROUTES.account;
  const isBilling = pathname === ROUTES.accountBilling;
  return (
    <SidebarLayout
      Header={
        <SidebarLayoutHeader
          Footer={
            <div className="flex flex-row items-center px-3 mx-auto max-w-4xl w-full">
              <Link
                href={ROUTES.account}
                className={cn(
                  "px-3  py-2 box-border hover:bg-primary/10 rounded-t-xl border-b-4 border-transparent transition-all duration-300",
                  isInformations && "border-b-primary"
                )}
              >
                Mes informations
              </Link>
              <Link
                href={ROUTES.accountBilling}
                className={cn(
                  "px-3  py-2 box-border hover:bg-primary/10 rounded-t-xl border-b-4 border-transparent transition-all duration-300",
                  isBilling && "border-b-primary"
                )}
              >
                Facturation
              </Link>
            </div>
          }
        >
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full ">
            <h1 className="text-2xl font-bold">Account</h1>
          </div>
        </SidebarLayoutHeader>
      }
    >
      <div className=" mx-auto max-w-4xl w-full">{children}</div>
    </SidebarLayout>
  );
};

export default AccountLayout;
