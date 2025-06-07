"use client";

import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface MrsAvatarProps extends Omit<ImageProps, "width" | "height"> {
  size: number;
  className?: string;
  children?: React.ReactNode;
  displayName?: string | null;
}
export const MrsAvatar = ({
  src,
  alt,
  size = 50,
  className,
  children,
  displayName,
}: MrsAvatarProps) => {
  const [isError, setIsError] = useState(!src);
  useEffect(() => {
    if (!src) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [src]);
  return (
    <div
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      className={cn(
        "flex flex-row items-center gap-2 justify-center overflow-hidden rounded-full aspect-square",
        className
      )}
    >
      {isError ? (
        children || (
          <MrsAvatarFallback displayName={displayName} className={className} />
        )
      ) : (
        <Image
          src={src || "/default-avatar.png"}
          alt={alt}
          width={size}
          height={size}
          className="w-full h-full"
          onError={() => {
            setIsError(true);
          }}
        />
      )}
    </div>
  );
};
export interface MrsAvatarFallbackProps {
  className?: string;
  children?: string;
  fontSize?: number;
  displayName?: string | null;
}
export const MrsAvatarFallback = ({
  children,
  className,
  fontSize = 42,
  displayName,
}: MrsAvatarFallbackProps) => {
  return (
    <svg
      className={cn("!w-full !h-full bg-primary/20 text-primary", className)}
      viewBox="0 0 100 100"
    >
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        className="h-full w-full text-center fill-current font-normal"
      >
        {displayName ? displayNameToFallback(displayName) : children}
      </text>
    </svg>
  );
};
const displayNameToFallback = (displayName: string | null = "") => {
  const capitalized = displayName?.toUpperCase();
  const firstLetters = capitalized?.split(" ").map((word) => word[0]);
  return (
    firstLetters?.[0] + (firstLetters?.[1] || capitalized?.[1] || "") || ""
  );
};
