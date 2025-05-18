import { useTouchEvents } from "@/hooks/useTouchEvents";
import { useRef } from "react";

interface MrsGestureBoxProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  onPressEnter?: () => void;
  onPressLeave?: () => void;
}

export const MrsGestureBox = ({
  children,
  className,
  onPress,
  onPressStart,
  onPressEnd,
  onPressEnter,
  onPressLeave,
}: MrsGestureBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useTouchEvents(ref, {
    onTouchStart: onPressStart,
    onTouchEnd: onPressEnd,
    onTouchEnter: onPressEnter,
    onTouchLeave: onPressLeave,
  });
  return (
    <div
      ref={ref}
      className={className}
      onClick={onPress}
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseEnter={onPressEnter}
      onMouseLeave={onPressLeave}
    >
      {children}
    </div>
  );
};
