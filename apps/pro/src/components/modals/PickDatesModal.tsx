import { addDays, format, isSameDay, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { ModalProps } from "@/hooks/useModale";
import {
  MrsModal,
  MrsModalContent,
  MrsModalHeader,
  MrsModalTitle,
} from "../mrs/MrsModal";
import { CustomCalendar, CustomCalendarDay } from "../mrs/MrsCalendar";

interface PickDatesModalProps extends ModalProps {
  onSelectDate: (dates: Date[]) => void;
  dates: Date[];
}
export const PickDatesModal = (props: PickDatesModalProps) => {
  const handleSelectDates = (selectedDates: Date[]) => {
    const allSelectedExist = selectedDates.every((selectedDate) =>
      props.dates.some((existingDate) => isSameDay(existingDate, selectedDate))
    );
    let newDates: Date[] = [];
    if (allSelectedExist) {
      newDates = props.dates.filter(
        (date) =>
          !selectedDates.some((selectedDate) => isSameDay(date, selectedDate))
      );
    } else {
      newDates = [...props.dates, ...selectedDates].filter(
        (date, index, self) =>
          index === self.findIndex((t) => isSameDay(t, date))
      );
    }
    props.onSelectDate(newDates);
  };
  return (
    <MrsModal {...props}>
      <MrsModalContent className="w-full max-w-md p-0 flex flex-col max-h-[90vh] min-h-[50vh] gap-0">
        <MrsModalHeader className="min-h-12 flex flex-row items-center justify-between px-4 border-b">
          <MrsModalTitle>Sélectionner les jours</MrsModalTitle>
        </MrsModalHeader>
        <div className="flex flex-1 w-full flex-col">
          <CustomCalendar
            classNames={{
              container: "h-full w-full flex-1",
              weeksContainer: "h-full w-full flex-1 p-4",
            }}
            components={{
              Day: (date) => {
                return (
                  <CustomCalendarDay
                    date={date}
                    onPress={() => {}}
                    onPressStart={() => {}}
                    onPressEnd={handleSelectDates}
                    onPressEnter={() => {}}
                    className="!p-0"
                  >
                    {({
                      isInCurrentMonth,
                      isInSelectionRange,
                      isNextDayInSelectionRange,
                      isPrevDayInSelectionRange,
                      isPastDate,
                    }) => {
                      const isNextDaySelected = props.dates?.some((d) =>
                        isSameDay(d, addDays(date, 1))
                      );
                      const isPrevDaySelected = props.dates?.some((d) =>
                        isSameDay(d, subDays(date, 1))
                      );
                      const isSelected = props.dates?.some((d) =>
                        isSameDay(d, date)
                      );
                      return (
                        <div
                          className={cn(
                            "bg-full h-full w-full flex justify-center items-center cursor-pointer rounded-xl",

                            isSelected && "bg-primary text-primary-foreground",
                            isInSelectionRange && "bg-primary/30 text-primary",
                            !isInCurrentMonth && "opacity-50",
                            isPastDate && "opacity-50",
                            !isInCurrentMonth && isPastDate && "opacity-0",
                            isNextDayInSelectionRange || isNextDaySelected
                              ? "rounded-r-none"
                              : "rounded-r-xl",
                            isPrevDayInSelectionRange || isPrevDaySelected
                              ? "rounded-l-none"
                              : "rounded-l-xl"
                          )}
                        >
                          {format(date, "dd")}
                        </div>
                      );
                    }}
                  </CustomCalendarDay>
                );
              },
            }}
          />
        </div>
      </MrsModalContent>
    </MrsModal>
  );
};

// const PickDatesModalCalendrHeader = () => {
//   const { visibleMonth, setVisibleMonth } = useCustomCalendarContext();
//   return (
//     <div
//       className={cn(
//         "flex items-center justify-between mb-2 border-b px-4 py-2"
//       )}
//     >
//       <span className="font-bold text-lg">
//         {capitalizeFirstLetter(
//           format(visibleMonth, "MMMM yyyy", { locale: fr })
//         )}
//       </span>
//       <div className="flex items-center gap-2">
//         <Button
//           variant="primary-light"
//           onClick={() => setVisibleMonth(subYears(visibleMonth, 1))}
//           size="icon"
//           disabled={isSameYear(visibleMonth, new Date())}
//         >
//           <ChevronsLeft />
//         </Button>
//         <Button
//           variant="primary-light"
//           onClick={() => setVisibleMonth(subMonths(visibleMonth, 1))}
//           size="icon"
//           disabled={isSameMonth(visibleMonth, new Date())}
//         >
//           <ChevronLeft />
//         </Button>
//         <Button
//           variant="primary-light"
//           onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
//           size="icon"
//         >
//           <ChevronRight />
//         </Button>
//         <Button
//           variant="primary-light"
//           onClick={() => setVisibleMonth(addYears(visibleMonth, 1))}
//           size="icon"
//         >
//           <ChevronsRight />
//         </Button>
//       </div>
//     </div>
//   );
// };
