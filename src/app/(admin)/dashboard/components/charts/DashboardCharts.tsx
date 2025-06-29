"use client";
import React, { useState, useEffect } from "react";
import { BarChart2, LineChart, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { fetchRevenueOverTime } from "../../utils/fetchAnalytics";
import "../../styles/dashboard.css";

// Dynamically import chart components with SSR disabled
const BarChartOne = dynamic(() => import("./BarChartOne"), { ssr: false });
const LineChartOne = dynamic(() => import("./LineChartOne"), { ssr: false });

const chartTabs = [
  { label: "Sales Overview", value: "bar", icon: <BarChart2 size={18} /> },
  { label: "User Growth", value: "line", icon: <LineChart size={18} /> },
];

interface DashboardChartsProps {
  dateRange: string;
  currency: string;
}

export default function DashboardCharts({ dateRange, currency }: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState("bar");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform API data to Chart.js format
  function getBarChartData() {
    return {
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
  }

  function getLineChartData() {
    return {
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
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchRevenueOverTime({ range: dateRange })
      .then((data) => {
        setSalesData(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Erreur lors du chargement des statistiques.");
        setLoading(false);
      });
  }, [dateRange]);

  // Dummy export handler
  const handleExport = () => {
    if (!salesData.length) return alert("No data to export.");
    const csv = [
      Object.keys(salesData[0]).join(","),
      ...salesData.map((row) => Object.values(row).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_overview.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.92)",
        borderRadius: 20,
        boxShadow: "0 8px 32px 0 rgba(124, 58, 237, 0.13), 0 2px 8px 0 rgba(59, 130, 246, 0.08)",
        padding: 32,
        border: "1px solid #a5b4fc",
        minWidth: 0,
        minHeight: 320,
        backdropFilter: "blur(8px) saturate(1.1)",
        marginBottom: 24,
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto 24px auto"
      }}
    >
      {/* Tab Switcher and Export */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
        gap: 16,
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          {chartTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 20px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
                background: activeTab === tab.value ? "linear-gradient(90deg, #6366f1 0%, #a78bfa 100%)" : "#f3f4f6",
                color: activeTab === tab.value ? "#fff" : "#6b7280",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 4px 0 rgba(124, 58, 237, 0.04)",
                transition: "background 0.18s, color 0.18s, box-shadow 0.18s"
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleExport}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 16,
            background: "linear-gradient(90deg, #6366f1 0%, #a78bfa 100%)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px 0 rgba(124, 58, 237, 0.10)",
            transition: "background 0.18s, transform 0.18s"
          }}
        >
          <Download size={18} />
          Export
        </button>
      </div>
      {/* Chart Area */}
      <div
      style={{
      minHeight: 320,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
      }}
      >
      {loading ? (
      <div>Loading chart...</div>
      ) : error ? (
      <div style={{ color: "#dc2626", fontWeight: 600 }}>{error}</div>
      ) : getBarChartData().labels.length === 0 ? (
      <div>No data available for this period.</div>
      ) : activeTab === "bar" ? (
      <BarChartOne data={getBarChartData()} currency={currency} />
      ) : (
      <LineChartOne data={getLineChartData()} currency={currency} />
      )}
      </div>
    </div>
  );
}
