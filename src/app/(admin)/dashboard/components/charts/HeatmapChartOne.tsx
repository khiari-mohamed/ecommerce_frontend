import React from "react";
import HeatMap from "react-heatmap-grid";
import "../../styles/dashboard.css";

// Example data
const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const yLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
const data = [
  [12, 18, 32, 14, 20, 25, 10],
  [22, 28, 12, 24, 30, 15, 20],
  [32, 8, 22, 14, 10, 25, 30],
  [18, 28, 12, 24, 20, 15, 10],
];

export default function HeatmapChartOne() {
  return (
    <div className="heatmapchartone-root">
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
    </div>
  );
}