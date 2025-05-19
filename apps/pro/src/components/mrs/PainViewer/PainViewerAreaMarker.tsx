import React from "react";
import { cn } from "@/lib/utils";
import { PainArea } from "./types";
import { PAIN_PICKER_VALUES } from "./constants";

interface PainViewerAreaMarkerProps {
  painArea: PainArea;
}

const PainViewerAreaMarker: React.FC<PainViewerAreaMarkerProps> = ({
  painArea,
}) => {
  return (
    <div
      className={cn(
        "touch-none flex items-center justify-center bg-opacity-50 rounded-full absolute -translate-x-1/2 -translate-y-1/2",
        PAIN_PICKER_VALUES[painArea.level].className
      )}
      style={{
        left: `${painArea.x || 0}%`,
        top: `${painArea.y || 0}%`,
        width: `${painArea.size || 5}%`,
        height: `${painArea.size || 5}%`,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <text
          x="50"
          y="50"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ fontSize: "50" }}
          className="fill-current"
        >
          {painArea.level}
        </text>
      </svg>
    </div>
  );
};

export default PainViewerAreaMarker;
