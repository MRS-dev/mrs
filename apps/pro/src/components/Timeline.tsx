"use client";
interface TimelineDateProps {
  title: React.ReactNode;
  components?: {
    Header?: React.ReactNode;
  };
  children: React.ReactNode;
}

export const TimelineDate = ({
  children,
  components,
  title,
}: TimelineDateProps) => {
  return (
    <div className="flex flex-row gap-2">
      <div className="w-4  flex flex-col justify-center items-center opacity">
        <div className="flex h-1 w-4  justify-center">
          <div className="w-0 border-l-2 border-primary/50 h-full " />
        </div>
        <div className="h-2 w-2 rounded-full  aspect-square flex justify-center items-center border-2 border-transparent bg-primary"></div>
        <div className="flex flex-1 w-4  justify-center">
          <div className="w-0 border-l-2 border-dotted border-primary/30 h-full " />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        {components?.Header ? (
          components.Header
        ) : (
          <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
        )}
        <div className="flex flex-col pt-2 gap-2 pb-4">{children}</div>
      </div>
    </div>
  );
};
