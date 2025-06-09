"use client";

import React, { useState } from "react";
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
import { useAdStatsQuery } from "@/queries/ads/useAdStats";

// Register Chart.js modules
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ViewAdModalProps extends ModalProps {
  adId: string;
}

export const ViewAdModal = (props: ViewAdModalProps) => {
  const [chartData] = useState<ChartData<"bar", number[], string> | null>(null);
  const statsQuery = useAdStatsQuery(props.adId);

  // useEffect(() => {
  //   if (statsQuery.data) {
  //     const data = statsQuery.data;
  //     const labels = data.map((entry) => entry._id);
  //     const clicks = data.map((entry) => entry.clicks);
  //     const views = data.map((entry) => entry.views);

  //     const formattedData: ChartData<"bar", number[], string> = {
  //       labels,
  //       datasets: [
  //         { label: "Clics", data: clicks },
  //         { label: "Vues", data: views },
  //       ],
  //     };

  //     setChartData(formattedData);
  //   }
  // }, [statsQuery.data]);

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
        </div>
      </MrsModalContent>
    </MrsModal>
  );
};
