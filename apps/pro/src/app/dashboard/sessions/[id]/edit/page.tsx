"use client";
import SidebarLayout from "@/components/core/SidebarLayout";
import SidebarLayoutHeader from "@/components/core/SidebarLayoutHeader";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";
import {
  Exercise,
  ExercisesEditor,
  useExercisesEditor,
} from "@/components/ExercisesEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import { useModal } from "@/hooks/useModale";
import { PickDatesModal } from "@/components/modals/PickDatesModal";
import PatientPicker from "@/components/modals/PatientPickerModal";
import { useUpdateWorkoutSession } from "@/queries/workoutSessions/useUpdateWorkoutSession";
import { useWorkoutSession } from "@/queries/workoutSessions/useWorkoutSession";
import { useEffect, useState } from "react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

export default function NewSession() {
  const { id } = useParams<{
    id: string;
  }>();
  const sessionQuery = useWorkoutSession(id);

  const updateSessionMutation = useUpdateWorkoutSession();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  const exercisesEditor = useExercisesEditor({
    exercises: exercises,
    onChangeExercises: (newExercises) => setExercises(newExercises),
  });
  const isMutating = updateSessionMutation.isPending;
  const pickDateModal = useModal({
    defaultOpen: false,
  });
  useEffect(() => {
    if (sessionQuery.data) {
      setExercises(sessionQuery.data.program?.exercises || []);
      setDate(new Date(sessionQuery.data.date));
    }
  }, [sessionQuery.data]);
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
                  updateSessionMutation.mutate({
                    param: {
                      id,
                    },
                    json: {
                      patientId: sessionQuery.data?.patientId || "",
                      program: { exercises },
                      date,
                    },
                  })
                }
                disabled={isMutating}
              >
                {isMutating && <Loader2 className="size-4 animate-spin" />}
                <span>Mettre à jour</span>
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
              value={sessionQuery.data?.patientId || ""}
              onChange={(patientId: string) => {
                console.log("patientId", patientId);
              }}
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
              <span>
                {format(sessionQuery.data?.date || new Date(), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </span>
            </Button>
          </div>
          <ExercisesEditor
            {...exercisesEditor}
            askConfirmationToDelete={id !== "new"}
          />
          <PickDatesModal
            {...pickDateModal}
            onSelectDate={(dates: Date[]) => {
              setDate(dates[0]);
            }}
            dates={[date]}
          />
        </div>
      </ScrollArea>
    </SidebarLayout>
  );
}
