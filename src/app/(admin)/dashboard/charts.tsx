"use client";
import React, { useState, useEffect } from "react";
import BarChartOne from "./components/charts/BarChartOne";
import LineChartOne from "./components/charts/LineChartOne";
import { fetchRevenueOverTime } from "./utils/fetchAnalytics";
import "./styles/dashboard.css";

const DATE_RANGES = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
];

export default function DashboardChartsPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRevenueOverTime({ range: dateRange })
      .then((data) => {
        setSalesData(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dateRange]);

  const barChartData = {
    labels: salesData.map((d) => d.label),
    datasets: [
      {
        label: "Sales",
        data: salesData.map((d) => d.totalRevenue),
        backgroundColor: "rgba(59,130,246,0.7)",
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 32,
      },
    ],
  };

  const lineChartData = {
    labels: salesData.map((d) => d.label),
    datasets: [
      {
        label: "Orders",
        data: salesData.map((d) => d.orderCount),
        fill: true,
        borderColor: "rgba(139,92,246,1)",
        backgroundColor: "rgba(139,92,246,0.15)",
        tension: 0.4,
        pointBackgroundColor: "rgba(139,92,246,1)",
        pointBorderColor: "#fff",
        pointRadius: 6,
        pointHoverRadius: 9,
      },
    ],
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#7c3aed", margin: "32px 0 24px 0", textAlign: "center" }}>
          Charts Overview
        </h1>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <select
            className="dashboard-chart-area-select"
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
          >
            {DATE_RANGES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="dashboard-chart-area-container">
          <h2 className="dashboard-chart-area-title">Bar Chart (Sales Overview)</h2>
          <div className="dashboard-chart-area-content">
            {loading ? (
              <div>Loading chart...</div>
            ) : barChartData.labels.length === 0 ? (
              <div>No data available for this period.</div>
            ) : (
              <BarChartOne data={barChartData} currency="DT" />
            )}
          </div>
        </div>
        <div className="dashboard-chart-area-container">
          <h2 className="dashboard-chart-area-title">Line Chart (User Growth)</h2>
          <div className="dashboard-chart-area-content">
            {loading ? (
              <div>Loading chart...</div>
            ) : lineChartData.labels.length === 0 ? (
              <div>No data available for this period.</div>
            ) : (
              <LineChartOne data={lineChartData} currency="DT" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
