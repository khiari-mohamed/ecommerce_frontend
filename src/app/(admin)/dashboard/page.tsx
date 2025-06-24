"use client";
import React, { useState } from "react";
import MetricCards from "./components/common/MetricCards";
import RecentActivity from "./components/common/RecentActivity";
import "./styles/dashboard.css";

const DATE_RANGES = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
];

export default function DashboardHomePage() {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        {/* Metrics Cards Row */}
        <section className="dashboard-metrics-row">
          <MetricCards dateRange={dateRange} currency="DT" />
        </section>

        {/* Recent Orders Row Only */}
        <section className="dashboard-main-row">
          {/* Recent Orders Card */}
          <div className="dashboard-activity-card">
            <div className="dashboard-card-header">
              <h2 className="dashboard-card-title">Recent Activity</h2>
              <button className="dashboard-view-all-btn">
                View All
              </button>
            </div>
            <RecentActivity limit={10} />
          </div>
        </section>
      </div>
    </div>
  );
}
