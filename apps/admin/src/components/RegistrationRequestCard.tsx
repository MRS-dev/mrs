import { Calendar, Mail, Phone } from "lucide-react";

interface RegistrationRequestCardProps {
  id: string;
  firstName: string;
  lastName: string;
  acceptedAt: Date | null;
  rejectedAt: Date | null;
  email: string;
  phoneNumber: string;
  message: string;
  onClick: () => void;
}
export const RegistrationRequestCard = ({
  firstName,
  lastName,
  acceptedAt,
  rejectedAt,
  email,
  phoneNumber,
  message,
  onClick,
}: RegistrationRequestCardProps) => {
  return (
    <div
      className="bg-background rounded-xl border shadow-sm p-4 flex flex-col items-start gap-2 hover:shadow-md cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-2 text-base font-bold text-foreground w-full">
        <div className="line-clamp-1 flex-1">{`${firstName} ${lastName}`}</div>
        <span
          className={
            acceptedAt
              ? "bg-green-500 text-white px-2 py-1 rounded-md"
              : rejectedAt
                ? "bg-red-500 text-white px-2 py-1 rounded-md"
                : "bg-yellow-500 text-white px-2 py-1 rounded-md"
          }
        >
          {acceptedAt ? "Accepté" : rejectedAt ? "Rejeté" : "En attente"}
        </span>
      </div>
      <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground flex-1">
        <div className="flex flex-row items-center gap-2">
          <Mail className="size-4 text-primary" />
          <span>{email}</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Phone className="size-4 text-primary" />
          <span>{phoneNumber}</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Calendar className="size-4 text-primary" />
          <span>
            {/* {format(new Date(requestedCallDateTime), "dd/MM/yyyy HH:mm")} */}
          </span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="line-clamp-2">{message}</div>
        </div>
      </div>
      {/* {!acceptedAt && !rejectedAt && (
        <div className="flex flex-row items-center gap-2 w-full justify-end border-t border-neutral-200 pt-2 mt-2">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              acceptRegistrationRequestMutation.mutate({ json: { id: id } });
            }}
            disabled={acceptRegistrationRequestMutation.isPending}
          >
            {acceptRegistrationRequestMutation.isPending && (
              <LoaderCircle className="size-4 animate-spin" />
            )}
            <span>Accepter</span>
          </Button>
          <Button
            variant="destructive"
              onClick={() => onReject()}
              disabled={onRejectLoading || onAcceptLoading}
          >
            {onRejectLoading && <LoaderCircle className="size-4 animate-spin" />}
            <span>Refuser</span>
          </Button>
        </div>
      )} */}
    </div>
  );
};
