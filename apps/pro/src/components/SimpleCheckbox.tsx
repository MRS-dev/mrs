"use client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SimpleCheckboxProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked: boolean;
}
export const SimpleCheckbox = ({
  checked,
  onClick,
  className,
}: SimpleCheckboxProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-6 h-6 overflow-visible border rounded-full transition-all duration-300",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-neutral-200 bg-background ",
        className
      )}
    >
      {checked && <Check className="size-4 text-primary-foreground" />}
    </button>
  );
};
