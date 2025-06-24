import React from "react";
import { Doughnut } from "react-chartjs-2";
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

export interface DonutChartOneProps {
  labels: string[];
  data: number[];
  backgroundColors?: string[];
  title?: string;
  cutout?: string | number;
}

export default function DonutChartOne({
  labels,
  data,
  backgroundColors = [
    "rgba(139,92,246,0.85)",
    "rgba(59,130,246,0.85)",
    "rgba(251,191,36,0.85)",
    "rgba(16,185,129,0.85)",
    "rgba(244,63,94,0.85)",
  ],
  title = "Donut Chart",
  cutout = "70%",
}: DonutChartOneProps) {
  const chartData: ChartData<"doughnut"> = {
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

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
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

  return (
    <div className="donutchartone-root">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
