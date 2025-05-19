"use client";
import { useQuery } from "@tanstack/react-query";
import PainViewer from "./PainViewer/PainViewer";
import { PainArea } from "@/types/session";
import { useWorkoutSession } from "@/queries/workoutSessions/useWorkoutSession";

function LastSessionPainCard({ patientId }: { patientId: string }) {
  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: () => getLastSession({ patientId }),
  });

  console.log("sessionsQuery.data", sessionsQuery.data);

  const exercisesReport = sessionsQuery.data?.report?.exercises || [];
  const allPains = exercisesReport.reduce((acc: PainArea[], exercise) => {
    if (exercise?.painAreas) {
      return acc.concat(exercise?.painAreas);
    }
    return acc;
  }, []);
  return (
    <div className="flex flex-col border rounded-xl bg-background">
      <h3 className="p-4 text-lg font-semibold truncate">
        Douleurs lors de la dernière séance
      </h3>
      <div className="flex-1 p-4 pt-0 flex flex-row gap-2">
        <PainViewer painAreas={allPains} face="front" model="men" />
        <PainViewer painAreas={allPains} face="back" model="men" />
      </div>
    </div>
  );
}
export default LastSessionPainCard;
