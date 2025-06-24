import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import "../../styles/dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const data: ChartData<"line"> = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Revenue",
      data: [12000, 15000, 14000, 17000, 20000, 18000, 22000],
      fill: true,
      borderColor: "rgba(59,130,246,1)", // blue-500
      backgroundColor: "rgba(59,130,246,0.15)",
      tension: 0.4,
      pointBackgroundColor: "rgba(59,130,246,1)",
      pointBorderColor: "#fff",
      pointRadius: 6,
      pointHoverRadius: 9,
    },
  ],
};

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#312e81",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#818cf8",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (items) => `Month: ${items[0].label}`,
        label: (item) => `Revenue: $${item.formattedValue}`,
      },
    },
  },
  animation: {
    duration: 1200,
    easing: "easeOutElastic",
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#64748b",
        font: { weight: "bold" },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#e0e7ef",
      },
      ticks: {
        color: "#64748b",
        font: { weight: "bold" },
      },
    },
  },
};

export default function AreaChartOne() {
  return (
    <div className="areachartone-root">
      <Line data={data} options={options} />
    </div>
  );
}