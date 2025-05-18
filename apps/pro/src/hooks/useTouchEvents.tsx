"use client";
import { useEffect, useState } from "react";

interface UseTouchEventsOptions {
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  onTouchEnter?: () => void;
  onTouchLeave?: () => void;
}

export const useTouchEvents = (
  ref: React.RefObject<HTMLElement | null>,
  options: UseTouchEventsOptions
) => {
  const { onTouchStart, onTouchEnd, onTouchEnter, onTouchLeave } = options;
  const [isPressed, setIsPressed] = useState(false);
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (element.contains(event.target as Node)) {
        setIsPressed(true);
        setIsInside(true);
        onTouchStart?.();
        onTouchEnter?.();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const lastTarget = event.target as Node;

      if (isInside && !element.contains(lastTarget)) {
        onTouchLeave?.();
      }
      if (isPressed) {
        onTouchEnd?.();
      }
      setIsPressed(false);
      setIsInside(false);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      const rect = element.getBoundingClientRect();
      const isInsideElement =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;

      if (isInsideElement && !isInside) {
        setIsInside(true);
        onTouchEnter?.();
      } else if (!isInsideElement && isInside) {
        setIsInside(false);
        onTouchLeave?.();
      }
    };

    // Attacher les gestionnaires globaux
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchmove", handleTouchMove);

    // Nettoyage des gestionnaires
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [
    ref,
    onTouchStart,
    onTouchEnd,
    onTouchEnter,
    onTouchLeave,
    isInside,
    isPressed,
  ]);

  return { isPressed, isInside };
};
