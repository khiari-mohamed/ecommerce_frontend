import React from "react";
import { Bar } from "react-chartjs-2";
import { useSpring, animated } from "@react-spring/web";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartOneProps {
  data: ChartData<"bar">;
  currency?: string;
}

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
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
        label: (item) => `Sales: ${item.formattedValue}`,
      },
    },
  },
  animation: { duration: 1200, easing: "easeOutElastic" },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#64748b", font: { weight: "bold" } },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#e0e7ef" },
      ticks: { color: "#64748b", font: { weight: "bold" } },
    },
  },
};

export default function BarChartOne({ data }: BarChartOneProps) {
  const spring = useSpring({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 120, friction: 14 },
    delay: 100,
  });

  const isEmpty =
    !data ||
    !data.labels ||
    (Array.isArray(data.labels) && data.labels.length === 0) ||
    !data.datasets ||
    data.datasets.length === 0 ||
    data.datasets.every(ds =>
      !ds.data ||
      (Array.isArray(ds.data) && ds.data.length === 0) ||
      (Array.isArray(ds.data) && ds.data.every((v: any) => !v))
    );

  return (
    <div className="dashboard-bar-or-line-chart-root">
      {React.createElement(
        animated.div,
        { style: spring },
        <div className="dashboard-bar-or-line-chart-inner">
          {isEmpty ? (
            <div className="text-center text-gray-500 py-12">
              <span>Aucune donnée de graphique disponible.</span>
            </div>
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>
      )}
    </div>
  );
}
