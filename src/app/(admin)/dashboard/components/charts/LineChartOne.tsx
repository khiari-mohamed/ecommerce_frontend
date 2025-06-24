import React from "react";
import { Line } from "react-chartjs-2";
import { useSpring, animated } from "@react-spring/web";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface LineChartOneProps {
  data: ChartData<"line">;
  currency?: string;
}

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "#581c87",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#a78bfa",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (items) => `Month: ${items[0].label}`,
        label: (item) => `Users: ${item.formattedValue}`,
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

export default function LineChartOne({ data }: LineChartOneProps) {
  const spring = useSpring({
    from: { opacity: 0, transform: "rotateY(-45deg) scale(0.9)" },
    to: { opacity: 1, transform: "rotateY(0deg) scale(1)" },
    config: { tension: 120, friction: 14 },
    delay: 100,
  });

  return (
    <div className="dashboard-bar-or-line-chart-root">
      {React.createElement(
        animated.div,
        { style: spring },
        <div className="dashboard-bar-or-line-chart-inner">
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
}
