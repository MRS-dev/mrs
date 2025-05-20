"use client";

import SidebarLayout from "@/components/core/SidebarLayout";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar, Loader2, Plus } from "lucide-react";
import {
  Exercise,
  ExercisesEditor,
  useExercisesEditor,
} from "@/components/ExercisesEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useParams, useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/useModale";
import { useCreateWorkoutSessionsByDates } from "@/queries/workoutSessions/useCreateWorkoutSessionsByDates";
import { PickDatesModal } from "@/components/modals/PickDatesModal";
import PatientPicker from "@/components/modals/PatientPickerModal";

export default function NewSession() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const { sessionId } = useParams<{
    sessionId: string;
  }>();
  const [sessionWithDates, setSessionWithDates] = useState<{
    patientId: string;
    program: {
      exercises: Exercise[];
    };
    dates: Date[];
  }>({
    patientId: patientId || "",
    program: {
      exercises: [],
    },
    dates: [],
  });

  const createSessionByDatesMutation = useCreateWorkoutSessionsByDates();

  const isMutating = createSessionByDatesMutation.isPending;

  const exercisesEditor = useExercisesEditor({
    exercises: sessionWithDates.program.exercises,
    onChangeExercises: (newExercises) =>
      setSessionWithDates((v) => ({
        ...v,
        program: { exercises: newExercises },
      })),
  });

  const pickDateModal = useModal({
    defaultOpen: false,
  });
  const renderDatePickerLabel = () => {
    if (!sessionWithDates.dates.length) {
      return "Sélectionner les dates";
    }
    if (sessionWithDates.dates.length === 1) {
      return format(sessionWithDates.dates[0], "dd MMMM yyyy", {
        locale: fr,
      });
    }
    return `${sessionWithDates.dates.length} dates sélectionnées`;
  };
  return (
    <SidebarLayout
      className="max-h-screen h-screen"
      Header={
        <SidebarLayoutHeader>
          <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
            <h1 className="text-2xl font-bold">Nouvelle séance</h1>
            <div className="flex flex-row items-center space-x-3">
              <Button
                variant="primary"
                onClick={() =>
                  createSessionByDatesMutation.mutate({
                    json: {
                      patientId: sessionWithDates.patientId || "",
                      program: sessionWithDates.program || {},
                      dates: sessionWithDates.dates || [],
                    },
                  })
                }
                disabled={isMutating}
              >
                {isMutating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                <span>Créer</span>
              </Button>
            </div>
          </div>
        </SidebarLayoutHeader>
      }
    >
      <ScrollArea className="flex flex-1 h-full w-full ">
        <div className="flex-1 max-w-2xl mx-auto w-full py-5 gap-4 flex flex-col pt-10">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Patient</h3>
            <PatientPicker
              value={sessionWithDates.patientId}
              onChange={(patientId: string) =>
                setSessionWithDates((v) => ({ ...v, patientId }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Dates de programmation</h3>
            <Button
              onClick={() => pickDateModal.onOpen()}
              variant="input"
              className="w-full max-w-sm h-12 flex flex-row items-center justify-start"
            >
              <Calendar className="size-4" />
              <span>{renderDatePickerLabel()}</span>
            </Button>
          </div>
          <ExercisesEditor
            {...exercisesEditor}
            askConfirmationToDelete={sessionId !== "new"}
          />
          <PickDatesModal
            {...pickDateModal}
            onSelectDate={(dates: Date[]) =>
              setSessionWithDates((v) => ({ ...v, dates }))
            }
            dates={sessionWithDates.dates}
          />
        </div>
      </ScrollArea>
    </SidebarLayout>
  );
}
