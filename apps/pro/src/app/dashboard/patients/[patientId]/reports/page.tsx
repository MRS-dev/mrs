"use client";
import { Button } from "@/components/ui/button";
import { Check, CircleX, Plus } from "lucide-react";
import { ROUTES } from "@/routes";
import { useMemo, useState } from "react";
import { format, startOfDay } from "date-fns";
import { isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimelineDate } from "@/components/Timeline";
import { fr } from "date-fns/locale/fr";
import { usePatient } from "@/queries/patients/usePatient";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useWorkoutSessions } from "@/queries/workoutSessions/useWorkoutSessions";
import { useModal } from "@/hooks/useModale";
import Link from "next/link";
import { SessionReportModal } from "@/components/modals/SessionReportModal";
import { useWorkoutSession } from "@/queries/workoutSessions/useWorkoutSession";

type SessionScheduledByDate = {
  key: string;
  date: Date;
  sessions: Record<string, unknown>[];
};

export default function PatientReports() {
  const { patientId } = useParams<{ patientId: string }>();
  const filter = useMemo(
    () => ({
      patientId,
      to: new Date().toISOString(),
      limit: "1000",
      page: "1",
    }),
    [patientId]
  );
  const workoutSessionsQuery = useWorkoutSessions(filter);
  const { data: patient } = usePatient(patientId);

  const sessionsByDate = useMemo(() => {
    const newSessionsByDate: SessionScheduledByDate[] = [];
    workoutSessionsQuery?.data?.pages
      .flatMap((page) => page.items)
      .forEach((session) => {
        const dateIsAlreadyInSessionsByDate = newSessionsByDate.find(
          (sessionByDate) => isSameDay(sessionByDate.date, session.date)
        );
        if (dateIsAlreadyInSessionsByDate) {
          dateIsAlreadyInSessionsByDate.sessions.push(session);
        } else {
          newSessionsByDate.push({
            key: startOfDay(session.date).toISOString(),
            date: new Date(session.date),
            sessions: [session],
          });
        }
      });
    return newSessionsByDate;
  }, [workoutSessionsQuery.data]);

  const reportModal = useModal({ defaultOpen: false });
  const [selectedSession, setSelectedSession] = useState<Record<
    string,
    unknown
  > | null>(null);

  const handleOpenReportModal = (session: Record<string, unknown>) => {
    setSelectedSession(session);
    reportModal.onOpen();
  };
  return (
    <div className="flex flex-col h-full max-h-full flex-1">
      <ScrollArea className="flex">
        <div className="flex-1 flex flex-col gap-3   w-full max-w-2xl mx-auto py-10 px-5">
          <div className="flex flex-row items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Rapports des séances passées
            </h2>
          </div>

          {sessionsByDate?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 bg-primary/10 backdrop-blur-md rounded-xl text-primary min-h-44">
              <h3 className="text-lg font-semibold m-0">
                Aucun rapport disponible pour l&apos;instant
              </h3>
              <p className="text-base">
                Créer une séance pour {patient?.firstName} {patient?.lastName}
              </p>
              <Button variant="default" asChild className="mt-4">
                <Link href={ROUTES.newSession + "?patientId=" + patientId}>
                  <Plus /> Nouvelle séance
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
              {sessionsByDate.map((sessionByDate) => (
                <TimelineDate
                  key={sessionByDate.key}
                  title={format(sessionByDate.date, "dd MMMM yyyy", {
                    locale: fr,
                  })}
                >
                  {sessionByDate.sessions?.map((session) => (
                    <div
                      className="p-4 border rounded-xl bg-background"
                      key={session.id as string}
                    >
                      <div className="flex flex-row items-center justify-start gap-2">
                        <h3 className="text-base font-medium">
                          Séance du{" "}
                          {format(session.date as Date, "dd MMMM yyyy", {
                            locale: fr,
                          })}
                        </h3>
                        <div className="flex flex-row items-center gap-2 flex-1">
                          <BadgeReportStatus sessionId={session.id as string} />
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleOpenReportModal(session)}
                        >
                          Afficher
                        </Button>
                      </div>
                    </div>
                  ))}
                </TimelineDate>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      {!!selectedSession && (
        <SessionReportModal
          {...reportModal}
          sessionId={selectedSession.id as string}
        />
      )}
    </div>
  );
}

const BadgeReportStatus = ({ sessionId }: { sessionId: string }) => {
  const { data: session } = useWorkoutSession(sessionId);
  const badge = useMemo(() => {
    const exercisesReports = session?.report?.exercises?.filter(
      (exerciseReport) => exerciseReport.status !== null
    );
    const allExercisesHaveReport =
      exercisesReports?.length === session?.program?.exercises?.length;
    const allExercisesAreCompleted =
      allExercisesHaveReport &&
      exercisesReports?.every(
        (exerciseReport) => exerciseReport.status === "completed"
      );
    if (allExercisesAreCompleted) {
      return {
        label: "Réussi",
        className: "bg-green-500/10 text-green-500",
        Icon: <Check className="size-3" />,
      };
    }
    if (allExercisesHaveReport) {
      return {
        label: "Partiellement réussi",
        className: "bg-amber-500/10 text-amber-500",
        Icon: <CircleX className="size-3" />,
      };
    }
    return {
      label: "Manqué",
      className: "bg-red-500/10 text-red-500",
      Icon: <CircleX className="size-3" />,
    };
  }, [session]);
  return (
    <span
      className={cn(
        "py-1 px-2 rounded-xl text-xs flex flex-row items-center gap-1",
        badge.className
      )}
    >
      {badge.Icon} {badge.label}
    </span>
  );
};
