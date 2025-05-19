import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
import { format, eachMonthOfInterval } from "date-fns";
import { fr } from "date-fns/locale";

import { Calendar } from "lucide-react";

interface MrsBirthdayPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

// Start of Selection
export const MrsBirthdayPicker = ({
  value,
  onChange,
}: MrsBirthdayPickerProps) => {
  const [day, setDay] = useState<string>(
    value ? value.getDate().toString() : ""
  );
  const [month, setMonth] = useState<string>(
    value ? (value.getMonth() + 1).toString() : ""
  ); // Months are 0-indexed
  const [year, setYear] = useState<string>(
    value ? value.getFullYear().toString() : ""
  );

  const visibleDays = useMemo(() => {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!m || !y) {
      return Array.from({ length: 31 }, (_, i) => i + 1);
    }

    const daysInMonth = new Date(y, m, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [month, year]);

  const months = useMemo(() => {
    return eachMonthOfInterval({
      start: new Date(2020, 0, 1), // Year is irrelevant here
      end: new Date(2020, 11, 1),
    }).map((date) => format(date, "LLLL", { locale: fr }));
  }, []);

  const handleDayChange = (
    event: React.MouseEvent<HTMLDivElement>,
    selectedDay: string
  ) => {
    if (!year || !month) event.preventDefault();

    setDay(selectedDay);
    updateDate(selectedDay, month, year);
  };

  const handleMonthChange = (
    event: React.MouseEvent<HTMLDivElement>,
    selectedMonth: string
  ) => {
    if (!year || !day) event.preventDefault();

    setMonth(selectedMonth);
    // Calculate the maximum days for the new month and current year
    const m = parseInt(selectedMonth, 10);
    const y = parseInt(year, 10);
    const daysInNewMonth = y && m ? new Date(y, m, 0).getDate() : 31;

    let newDay = parseInt(day, 10);
    if (newDay > daysInNewMonth) {
      newDay = daysInNewMonth;
      setDay(newDay.toString());
    }

    updateDate(newDay.toString(), selectedMonth, year);
  };

  const handleYearChange = (
    event: React.MouseEvent<HTMLDivElement>,
    selectedYear: string
  ) => {
    if (!month || !day) event.preventDefault();

    setYear(selectedYear);
    // Calculate the maximum days for the current month and new year
    const m = parseInt(month, 10);
    const y = parseInt(selectedYear, 10);
    const daysInNewMonth = y && m ? new Date(y, m, 0).getDate() : 31;

    let newDay = parseInt(day, 10);
    if (newDay > daysInNewMonth) {
      newDay = daysInNewMonth;
      setDay(newDay.toString());
    }

    updateDate(newDay.toString(), month, selectedYear);
  };

  const updateDate = (d: string, m: string, y: string) => {
    const dayNum = parseInt(d, 10);
    const monthNum = parseInt(m, 10) - 1; // Months are 0-indexed
    const yearNum = parseInt(y, 10);

    if (
      !isNaN(dayNum) &&
      !isNaN(monthNum) &&
      !isNaN(yearNum) &&
      dayNum > 0 &&
      monthNum >= 0 &&
      yearNum > 0
    ) {
      const newDate = new Date(yearNum, monthNum, dayNum);
      onChange(newDate);
    } else {
      onChange(null);
    }
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 150 }, (_, i) => currentYear - i);
  }, []);

  const [visible, setVisible] = useState(false);
  return (
    <div
      className={cn(
        "w-full border border-neutral-200 rounded-xl",
        visible && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <DropdownMenu onOpenChange={(v) => setVisible(v)}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex flex-row items-center justify-between w-full h-12 bg-muted rounded-xl border border-neutral-200 text-sm text-muted-foreground text-left ring-offset-2"
            )}
          >
            <div className="flex flex-row items-center gap-2 flex-1 pl-4">
              {value
                ? format(value, "dd MMMM yyyy", { locale: fr })
                : "Date de naissance"}
            </div>
            <div className=" h-full aspect-square justify-center items-center flex">
              <Calendar
                className={cn(
                  "size-4 text-muted-foreground"
                  //   visible && "text-primary"
                )}
              />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-[var(--radix-trigger-width)] w-auto flex flex-row"
          side="bottom"
          align="start"
          sideOffset={8}
          alignOffset={-2}
        >
          <div>
            <div className="text-sm text-center justify-center items-center text-foreground p-1 font-medium">
              Jour
            </div>
            <ScrollArea className="h-64 overflow-auto px-2 scroll-smooth">
              {visibleDays.map((d) => (
                <DropdownMenuItem
                  key={d}
                  className={cn(
                    "px-4  min-w-14 cursor-pointer rounded-xl bg-background text-sm text-center justify-center items-center text-muted-foreground",
                    d === (day ? parseInt(day, 10) : 0) &&
                      "!bg-muted shadow-sm sticky top-0 bottom-0 z-10 !text-primary"
                  )}
                  onClick={(event) => handleDayChange(event, d.toString())}
                >
                  {d?.toString().padStart(2, "0")}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </div>
          <div className="border-x border-neutral-200">
            <div className="text-sm text-center justify-center items-center text-foreground p-1 font-medium">
              Mois
            </div>
            <ScrollArea className="h-64 overflow-auto px-2 scroll-smooth">
              {months.map((m, index) => (
                <DropdownMenuItem
                  key={m}
                  className={cn(
                    "px-4  min-w-14  cursor-pointer rounded-xl bg-background text-sm text-center justify-center items-center text-muted-foreground",
                    index === (month ? parseInt(month, 10) - 1 : -1) &&
                      "!bg-muted shadow-sm sticky top-0 bottom-0 z-10 !text-primary"
                  )}
                  onClick={(event) =>
                    handleMonthChange(event, (index + 1).toString())
                  }
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </div>
          <div>
            <div className="text-sm text-center justify-center items-center text-foreground p-1 font-medium">
              Année
            </div>
            <ScrollArea className="h-64 overflow-auto px-2 scroll-smooth">
              {years.map((y, index) => (
                <DropdownMenuItem
                  key={y}
                  className={cn(
                    "px-4  min-w-14 cursor-pointer rounded-xl bg-background text-sm text-center justify-center items-center text-muted-foreground",
                    y === (year ? parseInt(year, 10) : 0) &&
                      "!bg-muted shadow-sm sticky top-0 bottom-0 z-10 !text-primary"
                  )}
                  onClick={(event) => handleYearChange(event, y.toString())}
                >
                  {y}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
