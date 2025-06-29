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

interface AreaChartOneProps {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

export default function AreaChartOne({ data, options }: AreaChartOneProps) {
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
    <div className="areachartone-root">
      {isEmpty ? (
        <div className="text-center text-gray-500 py-12">
          <span>Aucune donnée de graphique disponible.</span>
        </div>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
}