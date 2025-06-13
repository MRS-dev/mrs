"use client";

import React, { useMemo } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  MrsModal,
  MrsModalContent,
  MrsModalTitle,
} from "@/components/mrs/MrsModal";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ModalProps } from "@/hooks/useModale";
import { AdEventStat, useAdEventsStats } from "@/queries/ads/useAdEvents"; // <-- nouveau hook

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ViewAdModalProps extends ModalProps {
  adId: string;
}

export const ViewAdModal = (props: ViewAdModalProps) => {
  const statsQuery = useAdEventsStats({ adId: props.adId }); // ← hook

  // Format pour Chart.js (groupé par date)
  const chartData = useMemo(() => {
    if (!statsQuery.data) return null;

    const adEventStats = statsQuery.data as AdEventStat[];

    // 1. Extraire la date (YYYY-MM-DD) de chaque événement
    const allDates = adEventStats.map((s) => s.createdAt.slice(0, 10));
    const dates = Array.from(new Set(allDates)).sort();

    // 2. Initialiser les compteurs par date
    const viewsByDate: Record<string, number> = {};
    const clicksByDate: Record<string, number> = {};

    dates.forEach((date) => {
      viewsByDate[date] = 0;
      clicksByDate[date] = 0;
    });

    // 3. Compter les events
    adEventStats.forEach((s) => {
      const date = s.createdAt.slice(0, 10);
      if (s.type === "view") viewsByDate[date] += 1;
      if (s.type === "click") clicksByDate[date] += 1;
    });

    // 4. Structure pour Chart.js
    return {
      labels: dates,
      datasets: [
        {
          label: "Vues",
          data: dates.map((d) => viewsByDate[d] || 0),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Clics",
          data: dates.map((d) => clicksByDate[d] || 0),
          backgroundColor: "rgba(168, 109, 223, 0.6)",
        },
      ],
    } as ChartData<"bar", number[], string>;
  }, [statsQuery.data]);

  return (
    <MrsModal {...props}>
      <MrsModalContent className="w-full max-w-md p-0 flex flex-col max-h-[90vh] overflow-auto">
        <div className="flex flex-row items-center justify-between gap-4 px-4 py-2 sticky top-0 bg-background/70 backdrop-blur-sm border-b z-10">
          <MrsModalTitle>
            Stats de la publicité (7 derniers jours)
          </MrsModalTitle>
          <Button variant="ghost" size="sm" onClick={props.onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-5">
          {statsQuery.isLoading && <p>Chargement des statistiques...</p>}
          {statsQuery.isError && (
            <p className="text-red-500">Erreur : {statsQuery.error?.message}</p>
          )}
          {chartData && <Bar data={chartData} />}
          {!chartData && !statsQuery.isLoading && (
            <p>Aucune donnée à afficher.</p>
          )}
        </div>
      </MrsModalContent>
    </MrsModal>
  );
};
