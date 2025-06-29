"use client";
import React, { useState, useEffect } from "react";
import BarChartOne from "../components/charts/BarChartOne";
import LineChartOne from "../components/charts/LineChartOne";
import DonutChartOne from "../components/charts/DonutChartOne";
import PieChartOne from "../components/charts/PieChartOne";
import dynamic from "next/dynamic";
const HeatmapChartOne = dynamic(() => import("../components/charts/HeatmapChartOne"), { ssr: false });
import { fetchRevenueOverTime, fetchCategoryPerformance } from "../utils/fetchAnalytics";
import "../styles/dashboard.css";

const DATE_RANGES = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
];

export default function DashboardChartsPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryLabels, setCategoryLabels] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchRevenueOverTime({ range: dateRange }),
      fetchCategoryPerformance()
    ])
      .then(([sales, categories]) => {
        setSalesData(sales || []);
        const cats = (categories?.data || categories || []);
        setCategoryLabels(cats.map((c: any) => c.categoryName || c.name || c.category || c._id || ""));
        setCategoryData(cats.map((c: any) => c.totalSold || c.totalSales || c.count || 0));
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Erreur lors du chargement des statistiques.");
        setLoading(false);
      });
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
        {error && (
          <div className="text-center text-red-600 py-12 font-bold">{error}</div>
        )}
        <div className="dashboard-chart-area-container">
          <h2 className="dashboard-chart-area-title">Bar Chart (Sales Overview)</h2>
          <div className="dashboard-chart-area-content" style={{ minHeight: 250 }}>
            {loading ? (
              <div>Loading chart...</div>
            ) : (
              <BarChartOne data={barChartData} currency="DT" />
            )}
            {!loading && barChartData.labels.length === 0 && (
              <div>No data available for this period.</div>
            )}
          </div>
        </div>
        <div className="dashboard-chart-area-container">
          <h2 className="dashboard-chart-area-title">Line Chart (User Growth)</h2>
          <div className="dashboard-chart-area-content" style={{ minHeight: 250 }}>
            {loading ? (
              <div>Loading chart...</div>
            ) : (
              <LineChartOne data={lineChartData} currency="DT" />
            )}
            {!loading && lineChartData.labels.length === 0 && (
              <div>No data available for this period.</div>
            )}
          </div>
        </div>
        <div className="dashboard-chart-area-container">
          <h2 className="dashboard-chart-area-title">Donut Chart (Orders by Category)</h2>
          <div className="dashboard-chart-area-content" style={{ height: 250, maxWidth: 350, margin: "0 auto" }}>
            {loading ? (
              <div>Loading chart...</div>
            ) : categoryLabels.length === 0 ? (
              <div>No data available for this period.</div>
            ) : (
              <DonutChartOne labels={categoryLabels} data={categoryData} title="Orders by Category" />
            )}
          </div>
        </div>
        <div className="dashboard-chart-area-container">
          <h2 className="dashboard-chart-area-title">Pie Chart (Orders by Category)</h2>
          <div className="dashboard-chart-area-content" style={{ height: 250, maxWidth: 350, margin: "0 auto" }}>
            {loading ? (
              <div>Loading chart...</div>
            ) : categoryLabels.length === 0 ? (
              <div>No data available for this period.</div>
            ) : (
              <PieChartOne labels={categoryLabels} data={categoryData} title="Orders by Category" />
            )}
          </div>
        </div>
        <div className="dashboard-chart-area-container">
          <h2 className="dashboard-chart-area-title">Heatmap Chart (Demo)</h2>
          <div className="dashboard-chart-area-content">
            {/* <HeatmapChartOne
            xLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            yLabels={["Week 1", "Week 2", "Week 3", "Week 4"]}
            data={[
              [12, 18, 32, 14, 20, 25, 10],
              [22, 28, 12, 24, 30, 15, 20],
              [32, 8, 22, 14, 10, 25, 30],
              [18, 28, 12, 24, 20, 15, 10],
            ]}
          /> */}
          </div>
        </div>
      </div>
    </div>
  );
}