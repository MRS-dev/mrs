import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { MrsAvatar } from "./mrs/MrsAvatar";

interface AdminUserCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}
export const AdminUserCard = ({
  id,
  firstName,
  lastName,
  email,
  avatar,
}: AdminUserCardProps) => {
  return (
    <Link
      href={ROUTES.admin(id)}
      className={cn(
        "col-span-1 bg-background rounded-xl border shadow-sm p-4 flex flex-col items-start gap-2 hover:shadow-md cursor-pointer h-full"
      )}
    >
      <div className="flex flex-row items-center gap-2 w-full">
        <MrsAvatar
          className="h-12 w-12 bg-primary/10"
          displayName={`${firstName} ${lastName}`}
          size={48}
          src={avatar}
          alt={`${firstName} ${lastName}`}
        />
        <div className="flex flex-col flex-1 space-y-1 overflow-hidden">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center gap-2">
              <h3 className="text-base font-semibold line-clamp-1">
                {firstName} {lastName}
              </h3>
            </div>

            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </Link>
  );
};
