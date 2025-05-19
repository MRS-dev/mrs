import React from "react";
import { EDITORS_IMAGES } from "./constants";
import PainViewerAreaMarker from "./PainViewerAreaMarker";
import { cn } from "@/lib/utils";
import { Face, Model, PainArea } from "./types";
import Image from "next/image";

interface PainViewerProps {
  painAreas: PainArea[];
  model: Model;
  face: Face;
  withLabels?: boolean;
  className?: string;
}

const PainViewer: React.FC<PainViewerProps> = ({
  painAreas,
  model,
  face,
  withLabels = true,
  className,
}) => {
  const painAreaForFace = painAreas.filter(
    (painArea) => painArea.face === face
  );
  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="p-2 bg-muted/50 rounded-xl">
        <div className="relative w-full h-full aspect-square" key={face}>
          <div className="h-full aspect-square rounded-xl absolute left-1/2 top-1/2 touch-none -translate-x-1/2 -translate-y-1/2">
            <Image
              src={EDITORS_IMAGES[model][face]}
              alt="editor"
              className="h-full w-full object-contain"
            />
            {painAreaForFace?.map((painArea) => (
              <PainViewerAreaMarker key={painArea.key} painArea={painArea} />
            ))}
          </div>
        </div>
      </div>
      {withLabels && (
        <>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {face === "front" ? "Face avant" : "Face arrière"}
          </p>
          {painAreaForFace?.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              {painAreaForFace?.length} zones douloureuses
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Aucune zone douloureuse
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default PainViewer;
