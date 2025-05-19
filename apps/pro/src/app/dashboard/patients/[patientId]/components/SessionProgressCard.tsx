"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { type: "done", count: 15, fill: "var(--color-done)" },
  { type: "missed", count: 2, fill: "var(--color-missed)" },
];

const chartConfig = {
  done: {
    label: "Séances accomplies",
    color: "var(--primary)",
  },
  missed: {
    label: "Séances manquées",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function SessionProgressCard() {
  const sessionProgress = React.useMemo(() => {
    const doneCount =
      chartData.find((data) => data.type === "done")?.count || 0;
    const missedCount =
      chartData.find((data) => data.type === "missed")?.count || 0;
    return Math.round((doneCount / (doneCount + missedCount)) * 100);
  }, []);

  return (
    <div className="flex flex-col border rounded-xl bg-background">
      <h3 className="p-4 text-lg font-semibold">Analyse des Séances</h3>
      <div className="flex-1 p-4 pt-0 ">
        <ChartContainer config={chartConfig} className="mx-auto h-full w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {sessionProgress.toLocaleString()}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Réalisée
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
export default SessionProgressCard;
