"use client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { ROUTES } from "@/routes";
import { useEffect, useMemo, useState } from "react";
import { format, startOfDay } from "date-fns";
import { isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fr } from "date-fns/locale/fr";
import { useWorkoutSessions } from "@/queries/workoutSessions/useWorkoutSessions";
import { usePatient } from "@/queries/patients/usePatient";
import { useDeleteWorkoutSessions } from "@/queries/workoutSessions/useDeleteWorkoutSessions";
import { useModal } from "@/hooks/useModale";
import { MrsConfirmationModal } from "@/components/mrs/MrsConfirmationModal";
import { TimelineDate } from "@/components/Timeline";
import { SessionCard } from "@/components/SessionCard";

interface PatientData {
  firstName?: string;
  lastName?: string;
}

type SessionScheduledByDate = {
  key: string;
  date: Date;
  sessions: Record<string, unknown>[];
};

export default function PatientWorkoutSessions() {
  const { patientId } = useParams<{ patientId: string }>();
  const [mode, setMode] = useState<"default" | "select">("default");
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const filter = useMemo(
    () => ({
      patientId,
      from: new Date().toISOString(),
      limit: "1000",
      page: "1",
    }),
    [patientId]
  );
  const workoutSessionsQuery = useWorkoutSessions(filter);
  const { data } = workoutSessionsQuery;
  const workoutSessions = useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data]
  );

  const { data: patient } = usePatient(patientId);

  const sessionsByDate = useMemo(() => {
    const newSessionsByDate: SessionScheduledByDate[] = [];
    workoutSessions.forEach((session) => {
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
  }, [workoutSessions]);

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessions((prev) =>
      prev?.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };
  const deleteWorkOutSession = useDeleteWorkoutSessions({
    onSuccess: () => {
      // removeSessionsFromCache(selectedSessions);
      setMode("default");
      confirmDeleteModal.onClose();
    },
    onError: (error) => {
      console.log("error", error);
    },
  });
  const confirmDeleteModal = useModal();
  useEffect(() => {
    if (mode === "default" && !!selectedSessions?.length) {
      setSelectedSessions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className="flex flex-col h-full max-h-full flex-1">
      <ScrollArea className="flex">
        <div className="flex-1 flex flex-col gap-3   w-full max-w-2xl mx-auto py-10 px-5">
          <div className="flex flex-row items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Prochaines séances
            </h2>
            {sessionsByDate?.length > 0 && (
              <Button
                variant="primary-light"
                size="sm"
                onClick={() =>
                  setMode(mode === "select" ? "default" : "select")
                }
              >
                {mode === "select" ? "Annuler" : "Sélection"}
              </Button>
            )}
          </div>

          {sessionsByDate?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 bg-primary/10 backdrop-blur-md rounded-xl text-primary min-h-44">
              <h3 className="text-lg font-semibold m-0">
                Aucune séance programmée
              </h3>
              <p className="text-base">
                Créer une séance pour {(patient as unknown as PatientData)?.firstName}
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
                  {sessionByDate.sessions.map((session, index) => (
                    <SessionCard
                      workoutSessionId={session.id as string}
                      key={(session.id as string) || index}
                      mode={mode}
                      // onDeleteSuccess={() =>
                      //   removeSessionsFromCache([session.id as string])
                      // }
                      onSelect={() => handleSelectSession(session.id as string)}
                      onClick={() => {}}
                      selected={selectedSessions.includes(session.id as string)}
                      // onDuplicate={() => {
                      //   selectDatesForSessionModal.onOpen();
                      // }}
                    />
                  ))}
                </TimelineDate>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      {selectedSessions?.length > 0 && (
        <div className="w-full max-w-2xl mx-auto mb-3">
          <div className="flex flex-row gap-2 items-center  justify-end  px-5 py-3  rounded-xl">
            {mode === "select" && (
              <>
                <p className="text-sm text-muted-foreground">
                  {selectedSessions?.length} Séances sélectionnées
                </p>

                <Button
                  variant="destructive"
                  onClick={() => confirmDeleteModal.onOpen()}
                  disabled={
                    deleteWorkOutSession.isPending ||
                    selectedSessions?.length === 0
                  }
                >
                  {deleteWorkOutSession.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Supprimer
                </Button>
                <MrsConfirmationModal
                  {...confirmDeleteModal}
                  description="Voulez-vous vraiment supprimer ces séances ?"
                  title="Supprimer les séances"
                  onContinue={() => {
                    deleteWorkOutSession.mutate({
                      json: { ids: selectedSessions },
                    });
                  }}
                  onContinueLoading={deleteWorkOutSession.isPending}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
