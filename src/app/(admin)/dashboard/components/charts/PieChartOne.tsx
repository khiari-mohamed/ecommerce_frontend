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

const data: ChartData<"pie"> = {
  labels: ["Electronics", "Clothing", "Home", "Books", "Other"],
  datasets: [
    {
      label: "Category Share",
      data: [32, 21, 18, 15, 14],
      backgroundColor: [
        "rgba(139,92,246,0.85)",   // purple-500
        "rgba(59,130,246,0.85)",   // blue-500
        "rgba(16,185,129,0.85)",   // emerald-500
        "rgba(251,191,36,0.85)",   // yellow-400
        "rgba(244,63,94,0.85)",    // rose-500
      ],
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
        label: (item) => `${item.label}: ${item.formattedValue}%`,
      },
    },
  },
  animation: { duration: 1200, easing: "easeOutElastic" },
};

export default function PieChartOne() {
  return (
    <div className="piechartone-root">
      <Pie data={data} options={options} />
    </div>
  );
}