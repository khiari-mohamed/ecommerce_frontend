import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import "../../styles/dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieChartOneProps {
  labels: string[];
  data: number[];
  backgroundColors?: string[];
  title?: string;
}

export default function PieChartOne({
  labels,
  data,
  backgroundColors = [
    "rgba(139,92,246,0.85)",
    "rgba(59,130,246,0.85)",
    "rgba(16,185,129,0.85)",
    "rgba(251,191,36,0.85)",
    "rgba(244,63,94,0.85)",
  ],
  title = "Category Share",
}: PieChartOneProps) {
  const chartData: ChartData<"pie"> = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: backgroundColors.slice(0, data.length),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "#7c3aed",
          font: { weight: "bold" },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#312e81",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#818cf8",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (item) => `${item.label}: ${item.formattedValue}`,
        },
      },
    },
    animation: { duration: 1200, easing: "easeOutElastic" },
  };

  const isEmpty =
    !data ||
    !Array.isArray(data) ||
    data.length === 0 ||
    data.every((v) => !v);

  return (
    <div className="piechartone-root">
      {isEmpty ? (
        <div className="text-center text-gray-500 py-12">
          <span>Aucune donnée de graphique disponible.</span>
        </div>
      ) : (
        <Pie data={chartData} options={options} />
      )}
    </div>
  );
}