"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  createContext,
  useContext,
} from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  format,
  addDays,
  addYears,
  subYears,
  isWithinInterval,
  isBefore,
  subDays,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { fr } from "date-fns/locale/fr";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { MrsGestureBox } from "./MrsGestureBox";
import { Button } from "../ui/button";

interface RenderDayInfo {
  isInCurrentMonth: boolean;
  isHighlighted: boolean;
  isPrevDaySelected: boolean;
  isNextDaySelected: boolean;
  isInSelectionRange: boolean;
  isPrevDayInSelectionRange: boolean;
  isNextDayInSelectionRange: boolean;
  isPastDate: boolean;
}

interface CustomCalendarProps {
  dates?: Date[];
  initialVisibleMonth?: Date;
  onChange?: (dates: Date[]) => void;
  allowPastDates?: boolean;
  classNames?: {
    weeksContainer?: string;
    container?: string;
    headerContainer?: string;
  };
  components?: {
    Footer?: React.ReactNode;
    Day?: (day: Date) => React.ReactNode;
    WeekDaysHeader?: React.ReactNode;
    Header?: React.ReactNode;
  };
}

interface CustomCalendarContextType {
  visibleMonth: Date;
  setVisibleMonth: React.Dispatch<React.SetStateAction<Date>>;
  selectionRange: TSelectionRange;
  setSelectionRange: React.Dispatch<React.SetStateAction<TSelectionRange>>;
  selecting: boolean;
  setSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  weekDays: Date[];
}
type TSelectionRange = [Date | null, Date | null];
const CustomCalendarContext = createContext<CustomCalendarContextType>({
  visibleMonth: new Date(),
  setVisibleMonth: () => new Date(),
  selectionRange: [null, null],
  setSelectionRange: () => [null, null],
  selecting: false,
  setSelecting: () => false,
  weekDays: [],
});

export function isDateInRange(range: TSelectionRange, date: Date): boolean {
  const [start, end] = range;

  if (!start || !end) {
    return false;
  }

  return isWithinInterval(date, { start, end });
}
export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  initialVisibleMonth,
  classNames,
  components,
}) => {
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    initialVisibleMonth
      ? startOfMonth(initialVisibleMonth)
      : startOfMonth(new Date())
  );
  const [selecting, setSelecting] = useState(false);
  useEffect(() => {
    setVisibleMonth(
      initialVisibleMonth
        ? startOfMonth(initialVisibleMonth)
        : startOfMonth(new Date())
    );
  }, [initialVisibleMonth]);
  const [selectionRange, setSelectionRange] = useState<TSelectionRange>([
    null,
    null,
  ]);

  const title = capitalizeFirstLetter(
    format(visibleMonth, "MMMM yyyy", { locale: fr })
  );
  const allDays = useMemo(() => {
    const firstDayOfMonth = startOfMonth(visibleMonth);
    const lastDayOfMonth = endOfMonth(visibleMonth);

    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    return allDays;
  }, [visibleMonth]);

  const weeks = useMemo(() => {
    const weeksArray: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeksArray.push(allDays.slice(i, i + 7));
    }
    return weeksArray;
  }, [allDays]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end: addDays(start, 6) });
  }, []);

  return (
    <CustomCalendarContext.Provider
      value={{
        visibleMonth,
        setVisibleMonth,
        selectionRange,
        setSelectionRange,
        selecting,
        setSelecting,
        weekDays,
      }}
    >
      <div className={cn("flex flex-col", classNames?.container)}>
        {/* Header : boutons + titre du mois */}

        {components?.Header || (
          <div
            className={cn(
              "flex items-center justify-between mb-2 border-b px-4 py-2",
              classNames?.headerContainer
            )}
          >
            <span className="font-bold text-lg">{title}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setVisibleMonth(subYears(visibleMonth, 1))}
                size="icon"
              >
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                onClick={() => setVisibleMonth(subMonths(visibleMonth, 1))}
                size="icon"
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
                size="icon"
              >
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                onClick={() => setVisibleMonth(addYears(visibleMonth, 1))}
                size="icon"
              >
                <ChevronsRight />
              </Button>
            </div>
          </div>
        )}

        {/* Table des jours (une div par semaine) */}

        {components?.WeekDaysHeader || <CustomCalendarWeekDaysHeader />}
        <div
          className={cn(
            "grid grid-cols-7",
            weeks.length === 4 && "grid-rows-4",
            weeks.length === 5 && "grid-rows-5",
            weeks.length === 6 && "grid-rows-6",
            classNames?.weeksContainer
          )}
        >
          {/* Corps du calendrier : 4 à 6 lignes de 7 jours */}
          {weeks.map((week) => (
            <React.Fragment key={week[0].toISOString() + "week"}>
              {week.map((day) => (
                <React.Fragment key={day.toISOString() + "day"}>
                  {components?.Day ? (
                    components.Day(day)
                  ) : (
                    <CustomCalendarDay
                      date={day}
                      onPressStart={() => {}}
                      onPressEnd={() => {}}
                      onPressEnter={() => {}}
                      onPress={() => {}}
                    >
                      {({ isInCurrentMonth, isInSelectionRange }) => (
                        <div
                          className={cn(
                            "flex flex-1 justify-center items-center h-full w-full aspect-square cursor-pointer rounded-xl",
                            isInCurrentMonth
                              ? "text-foreground"
                              : "text-muted-foreground",
                            isInSelectionRange && "bg-primary/10"
                          )}
                        >
                          {format(day, "dd", { locale: fr })}
                        </div>
                      )}
                    </CustomCalendarDay>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
        {components?.Footer}
      </div>
    </CustomCalendarContext.Provider>
  );
};
export const useCustomCalendarContext = () => {
  const context = useContext(CustomCalendarContext);
  if (!context) {
    throw new Error(
      "useCustomCalendarContext must be used within a CustomCalendarProvider"
    );
  }
  return context;
};

interface CustomCalendarDayProps {
  date: Date;
  onPressStart?: () => void;
  onPressEnd?: (dates: Date[]) => void;
  onPressEnter?: () => void;
  onPress?: () => void;
  children: (props: RenderDayInfo) => React.ReactNode;
  className?: string;
}
export const CustomCalendarDay = ({
  date,
  onPressStart,
  onPressEnd,
  onPressEnter,
  onPress,
  children,
  className,
}: CustomCalendarDayProps) => {
  const {
    visibleMonth,
    setSelectionRange,
    selectionRange,
    setSelecting,
    selecting,
  } = useCustomCalendarContext();
  useCustomCalendarContext();
  const handleOnPressStart = () => {
    setSelecting(true);
    setSelectionRange([date, null]);
    onPressStart?.();
  };
  const handleOnPressEnd = () => {
    setSelecting(false);
    onPressEnd?.(eachDayOfInterval({ start: selectionRange[0]!, end: date }));
    setSelectionRange([null, null]);
  };
  const handleOnPressEnter = () => {
    console.log("handleOnPressEnter", selecting, selectionRange);
    if (selecting) {
      setSelectionRange((prev) => {
        console.log("prev", prev);
        const startDate = prev[0];
        if (startDate) {
          return [startDate, date];
        }
        return [date, null];
      });
    }
    onPressEnter?.();
  };
  const handleOnPress = () => {
    onPress?.();
  };

  const dayInfo = useMemo<RenderDayInfo>(() => {
    const isInCurrentMonth = isSameMonth(date, visibleMonth);
    const isInSelectionRange = isDateInRange(selectionRange, date);
    const isPrevDayInSelectionRange = isDateInRange(
      selectionRange,
      subDays(date, 1)
    );
    const isNextDayInSelectionRange = isDateInRange(
      selectionRange,
      addDays(date, 1)
    );
    return {
      isInSelectionRange,
      isInCurrentMonth,
      isHighlighted: false,
      isPrevDaySelected: false,
      isNextDaySelected: false,
      isPastDate: isBefore(date, new Date()),
      isPrevDayInSelectionRange,
      isNextDayInSelectionRange,
    };
  }, [date, selectionRange, visibleMonth]);

  const renderChildren = useMemo(() => {
    return children(dayInfo);
  }, [dayInfo, children]);
  return (
    <MrsGestureBox
      className={cn("select-none grid-cols-1", className)}
      onPressStart={() => handleOnPressStart()}
      onPressEnd={() => handleOnPressEnd()}
      onPressEnter={() => handleOnPressEnter()}
      onPress={() => handleOnPress()}
    >
      {renderChildren}
    </MrsGestureBox>
  );
};

interface WeekDaysHeaderProps {
  className?: string;
  renderWeekDayLabel?: (day: Date) => React.ReactNode;
}
export const CustomCalendarWeekDaysHeader = ({
  className,
  renderWeekDayLabel,
}: WeekDaysHeaderProps) => {
  const { weekDays } = useCustomCalendarContext();

  const renderDay = (day: Date) => {
    if (renderWeekDayLabel) {
      return renderWeekDayLabel(day);
    }

    const formattedDate = format(day, "EEEEEE", { locale: fr });
    return (
      <div className="grid-cols-1 text-center text-muted-foreground font-medium text-sm flex flex-1 justify-center items-center">
        {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
      </div>
    );
  };
  return (
    <div className={cn("grid grid-cols-7", className)}>
      {/* En-têtes des jours de la semaine (dynamique) */}
      {weekDays.map((day) => (
        <React.Fragment key={day.toISOString()}>
          {renderDay(day)}
        </React.Fragment>
      ))}
    </div>
  );
};
