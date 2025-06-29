import React from "react";
import HeatMap from "react-heatmap-grid";
import "../../styles/dashboard.css";

interface HeatmapChartOneProps {
  xLabels: string[];
  yLabels: string[];
  data: number[][];
}

export default function HeatmapChartOne({ xLabels, yLabels, data }: HeatmapChartOneProps) {
  const isEmpty =
    !data ||
    !Array.isArray(data) ||
    data.length === 0 ||
    data.every(row => !row || row.length === 0 || row.every(val => !val));

  return (
    <div className="heatmapchartone-root">
      {isEmpty ? (
        <div className="text-center text-gray-500 py-12">
          <span>Aucune donnée de heatmap disponible.</span>
        </div>
      ) : (
        <HeatMap
          xLabels={xLabels}
          yLabels={yLabels}
          data={data}
          squares
          cellStyle={(background, value, min, max, data, x, y) => ({
            background: `rgba(139,92,246,${(value - min) / (max - min) + 0.2})`,
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "0.5rem",
            border: "2px solid #ede9fe",
          })}
          cellRender={value => value && <span>{value}</span>}
          xLabelsStyle={() => ({
            color: "#7c3aed",
            fontWeight: "bold",
            fontSize: "1rem",
          })}
          yLabelsStyle={() => ({
            color: "#7c3aed",
            fontWeight: "bold",
            fontSize: "1rem",
          })}
        />
      )}
    </div>
  );
}