"use client";

import * as React from "react";
import { BicepsFlexed, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";

interface PickerProps<T> {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  options: { value: T; label: string }[];
  value?: T;
  onChange: (value?: T) => void;
}

export function MrsPicker<T>({
  icon = <BicepsFlexed className="size-4" />,
  label = "Label",
  placeholder = "Select...",
  options = [],
  value,
  onChange,
}: PickerProps<T>) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center  rounded-xl flex-row py-2 px-4 max-w-[200px] bg-muted space-x-2"
          aria-expanded={open}
          role="combobox"
          aria-controls="mrs-picker-content"
        >
          <div className="justify-center items-center text-muted-foreground ">
            {icon}
          </div>
          <div className="flex flex-col items-start justify-center flex-1 min-w-20">
            <p className="text-muted-foreground text-xs line-clamp-1">
              {label}
            </p>
            <p className="text-sm line-clamp-1 text-left">
              {!value ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                options.find((option) => option.value === value)?.label
              )}
            </p>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        id="mrs-picker-content"
        className="min-w-full w-52 p-0 rounded-xl"
      >
        <ScrollArea className="flex flex-col p-2 max-h-[200px] overflow-auto">
          {options.map((option) => {
            return (
              <div
                key={String(option.value)}
                className="flex flex-row items-center justify-between px-4 py-2 hover:bg-muted cursor-pointer text-sm font-medium text-muted-foreground rounded-sm first:rounded-t-xl last:rounded-b-xl"
                onClick={() => {
                  onChange(option.value === value ? undefined : option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
