import React from "react";
import { Reorder, AnimatePresence } from "motion/react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReorderableProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  getItemId: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  emptyMessage?: React.ReactNode;
  itemClassName?: string;
}

export function Reorderable<T>({
  items,
  onReorder,
  getItemId,
  renderItem,
  className,
  emptyMessage,
  itemClassName,
}: ReorderableProps<T>) {
  if (!items?.length && emptyMessage) {
    return <>{emptyMessage}</>;
  }

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className={cn("flex flex-1 flex-col gap-2 rounded-xl", className)}
    >
      <AnimatePresence>
        {items.map((item) => {
          const id = getItemId(item);
          return (
            <Reorder.Item value={item} id={id} key={id}>
              <div
                className={cn(
                  "flex flex-row border rounded-xl w-full",
                  itemClassName
                )}
              >
                <div className="hover:bg-muted p-3 pt-7 min-h-full cursor-grab rounded-l-xl">
                  <GripVertical className="size-5 text-muted-foreground/50" />
                </div>
                <div className="flex flex-1 py-4 pr-4 bg-background">
                  {renderItem(item)}
                </div>
              </div>
            </Reorder.Item>
          );
        })}
      </AnimatePresence>
    </Reorder.Group>
  );
}
