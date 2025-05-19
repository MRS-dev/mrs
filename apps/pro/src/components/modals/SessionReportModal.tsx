"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { BedDouble, Clock, Layers, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModalProps } from "@/hooks/useModale";
import { useWorkoutSession } from "@/queries/workoutSessions/useWorkoutSession";
import { useExercise } from "@/queries/exercises/useExercise";
import PainViewer from "../mrs/PainViewer/PainViewer";

interface IExercise {
  exerciseId: string;
  series: number;
  executionTime: number;
  restTime: number;
  repetitions: number;
}
interface SessionReportModalProps extends ModalProps {
  sessionId: string;
}
export const SessionReportModal: React.FC<SessionReportModalProps> = ({
  sessionId,
  ...props
}) => {
  const { data: session } = useWorkoutSession(sessionId);
  const date = session?.date || "";
  return (
    <Dialog {...props}>
      <DialogContent className="w-full max-w-2xl p-6 flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-foreground">
            Rapport de la séance du{" "}
            {!!date && format(date, "dd/MM/yyyy", { locale: fr })}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {session?.program?.exercises.map((exercise, index) => (
              <SessionExerciseCard
                key={exercise.exerciseId}
                exercise={exercise}
                index={index}
                sessionId={sessionId}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface SessionExerciseCardProps {
  exercise: IExercise;
  sessionId: string;
  index: number;
}
const SessionExerciseCard = ({
  exercise,
  index,
  sessionId,
}: SessionExerciseCardProps) => {
  const exerciseQuery = useExercise(exercise.exerciseId);
  const session = useWorkoutSession(sessionId);
  const report = session?.data?.report?.exercises?.find(
    (report) => report.exerciseIndex === index
  );
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <div className="w-20 h-20 bg-muted border rounded-xl">
          {/* <Image
      src={exercise.image}
      alt={exercise.name}
      width={40}
      height={40}
    /> */}
        </div>
        <div className="flex flex-col gap-2 flex-1 w-full">
          <div className="flex flex-row gap-2 items-center">
            <h3 className="text-base font-medium text-foreground">
              {exerciseQuery.data?.title}
            </h3>
            <SessionExerciseReportBadge status={report?.status} />
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-1 items-center justify-center">
              <Layers className="size-4" />
              <span className="text-sm text-muted-foreground">
                {exercise.series}
              </span>
            </div>
            <div className="flex flex-row gap-1 items-center justify-center">
              <Clock className="size-4" />
              <span className="text-sm text-muted-foreground">
                {exercise.executionTime}
              </span>
            </div>
            <div className="flex flex-row gap-1 items-center justify-center">
              <BedDouble className="size-4" />
              <span className="text-sm text-muted-foreground">
                {exercise.restTime}
              </span>
            </div>
            <div className="flex flex-row gap-1 items-center justify-center">
              <Repeat className="size-4" />
              <span className="text-sm text-muted-foreground">
                {exercise.repetitions}
              </span>
            </div>
          </div>
          {typeof report?.difficulty === "number" && (
            <div className="flex flex-row gap-2">
              <h3 className="text-base font-medium text-foreground">
                Difficulté de l&apos;exercise
              </h3>
              <span>{report?.difficulty}</span>
            </div>
          )}
          {!!report?.painAreas?.length && (
            <div className="flex flex-row gap-2 max-w-sm">
              <div className="w-1/2">
                <PainViewer
                  painAreas={report?.painAreas || []}
                  face={"front"}
                  model={"men"}
                />
              </div>
              <div className="w-1/2">
                <PainViewer
                  painAreas={report?.painAreas || []}
                  face={"back"}
                  model={"men"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
interface SessionExerciseReportBadgeProps {
  status?: string;
}
const SessionExerciseReportBadge = ({
  status = "unknown",
}: SessionExerciseReportBadgeProps) => {
  const defaultClassName = "py-1 px-2 rounded-full gap-1 text-xs";

  if (!status) return null;
  if (status === "completed") {
    return (
      <span className={cn(defaultClassName, "bg-green-500/10 text-green-500")}>
        Complété
      </span>
    );
  }
  if (status === "not_completed") {
    return (
      <span className={cn(defaultClassName, "bg-amber-500/10 text-amber-500")}>
        Partiellement réussi
      </span>
    );
  }
  if (status === "not_done") {
    return (
      <span className={cn(defaultClassName, "bg-red-500/10 text-red-500")}>
        Manqué
      </span>
    );
  }
  return (
    <span className={cn(defaultClassName, "bg-red-500/10 text-red-500")}>
      Manqué
    </span>
  );
};
