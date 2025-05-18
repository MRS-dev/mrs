import { cn } from "@/lib/utils";
import {
  CustomCalendar,
  CustomCalendarDay,
  useCustomCalendarContext,
} from "@/components/mrs/MrsCalendar";
import { useMemo } from "react";
import { endOfMonth, format, isSameDay, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { ROUTES } from "@/routes";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// function CalendarDay({
//   date,
//   status,
// }: {
//   date: Date;
//   status?: "success" | "error" | "normal" | undefined;
// }) {
//   return (
//     <div
//       className={cn(
//         "mx-1 p-2 rounded-md flex justify-center items-center relative w-full",
//         status === "success" && "bg-green-100",
//         status === "error" && "bg-red-100",
//         status === "normal" && "bg-primary/10"
//       )}
//     >
//       <span>{date.getDate()}</span>
//       {status === "success" && (
//         <Check className="text-green-500 absolute top-1 right-1 size-2" />
//       )}
//       {status === "error" && (
//         <X className="text-red-500 absolute top-1 right-1 size-2" />
//       )}
//       {status === "normal" && (
//         <div className="bg-primary absolute top-1 right-1 w-1 h-1 rounded-full" />
//       )}
//     </div>
//   );
// }

function SessionCalendarCard() {
  const { patientId } = useParams<{ patientId: string }>();

  const filter = useMemo(() => {
    return {
      patientId,
      date: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    };
  }, [patientId]);
  const allSessions = sessionsQuery.data?.data || [];
  const getSessionStatus = (session: ISession) => {
    const reportCount = session.report?.exercises?.length || 0;
    const exerciseCount = session.program.exercises.length;
    const sessionEnded = exerciseCount === reportCount;
    const exerciseCompleted = session.report?.exercises?.filter(
      (report) => report.status === "completed"
    );
    const exerciseNotDone = session.report?.exercises?.filter(
      (report) => report.status === "not_done" || !report.status
    );
    if (exerciseCompleted?.length === exerciseCount) return "completed";
    if (exerciseNotDone?.length === exerciseCount) return "not_done";
    if (reportCount === exerciseCount) return "not_completed";
    if (session.date < new Date()) return "missed";
    return "pending";
  };
  return (
    <div className="flex flex-col border rounded-xl aspect-square bg-background">
      <div className="flex-1 pt-0">
        <CustomCalendar
          classNames={{
            container: "h-full w-full flex-1",
            weeksContainer: "h-full w-full flex-1 gap-1 p-4",
          }}
          components={{
            Header: <SessionCardCalendarHeader />,
            Day: (date) => {
              return (
                <CustomCalendarDay
                  date={date}
                  onPress={() => {}}
                  onPressStart={() => {}}
                  onPressEnd={() => {}}
                  onPressEnter={() => {}}
                >
                  {({ isInCurrentMonth, isPastDate }) => {
                    const daySessions = allSessions.filter((session) =>
                      isSameDay(session.date, date)
                    );
                    return (
                      <div
                        className={cn(
                          "bg-full h-full w-full flex justify-center items-center cursor-pointer rounded-xl text-muted-foreground flex-col",
                          !isInCurrentMonth && "opacity-50",
                          isPastDate && "opacity-70 bg-transparent",
                          !isInCurrentMonth && isPastDate && "opacity-20",
                          !!daySessions?.length && " text-muted-foreground"
                        )}
                      >
                        {format(date, "dd")}
                        <div className="flex flex-row gap-1">
                          {daySessions.map((session) => {
                            const sessionStatus = getSessionStatus(session);
                            return (
                              <div
                                key={session._id}
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  sessionStatus === "completed" &&
                                    "bg-green-500",
                                  sessionStatus === "not_completed" &&
                                    "bg-amber-500",
                                  sessionStatus === "not_done" && "bg-red-500",
                                  sessionStatus === "missed" &&
                                    "bg-neutral-200",
                                  sessionStatus === "pending" && "bg-primary"
                                )}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  }}
                </CustomCalendarDay>
              );
            },
          }}
        />
        {/* <Calendar
          className="w-full p-0 max-w-full"
          classNames={{
            day: "p-2 rounded-md",
            table: "w-full max-w-full",
            caption_start: "w-full max-w-full",
            cell: "flex flex-1 p-1 w-full max-w-full",
            row: "w-full flex flex-row max-w-full",
            head: "w-full max-w-full",
            head_cell:
              "flex flex-1 p-1 w-full justify-center items-center text-xs text-muted-foreground",
          }}
          components={{
            Day: ({ date }) => {
              const dayData = calendarData.find(
                (d) => d.date.toDateString() === date.toDateString()
              );
              return (
                <CalendarDay
                  date={date}
                  status={
                    dayData
                      ? dayData.isDone === true
                        ? "success"
                        : dayData.isDone === false
                        ? "error"
                        : "normal"
                      : undefined
                  }
                />
              );
            },
          }}
        /> */}
      </div>
    </div>
  );
}

const SessionCardCalendarHeader = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { visibleMonth, setVisibleMonth } = useCustomCalendarContext();
  return (
    <div
      className={cn(
        "flex items-center justify-between mb-2 border-b px-4 py-2"
      )}
    >
      <span className="font-bold text-lg">
        {capitalizeFirstLetter(
          format(visibleMonth, "MMMM yyyy", { locale: fr })
        )}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="primary-light" size="sm" asChild>
          <Link to={ROUTES.patientSessions(patientId)}>Planifier</Link>
        </Button>
      </div>
    </div>
  );
};
export default SessionCalendarCard;
