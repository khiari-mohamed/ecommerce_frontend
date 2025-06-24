"use client";
import React, { useEffect, useState } from "react";
import { User, DollarSign, ShoppingCart, Activity } from "lucide-react";
import { fetchDashboardMetrics } from "../../utils/fetchDashboardData";

// Type for a metric card
export interface Metric {
  label: string;
  value: number;
  change: string;
  icon?: React.ReactNode;
  colorClass?: string; // Custom color class for icon background/text
  currency?: boolean; // If true, show currency
}

export interface MetricCardsProps {
  dateRange?: string; // e.g. "7d", "30d", "90d"
  currency?: string; // e.g. "DT"
}

// Animated count-up hook
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration]);
  return count;
}

// MetricCard component to encapsulate hook usage
function MetricCard({ metric, currency }: { metric: Metric; currency: string }) {
  const count = useCountUp(metric.value);

  return (
    <div className="dashboard-metric-card">
      {/* Icon */}
      <div className={`dashboard-metric-icon ${metric.colorClass}`}>
        {metric.icon}
      </div>
      {/* Label */}
      <span className="dashboard-metric-label">{metric.label}</span>
      {/* Animated Value */}
      <span className="dashboard-metric-value">
        {count.toLocaleString()}
        {metric.currency && (
          <span className="dashboard-metric-currency">{currency}</span>
        )}
      </span>
      {/* Change */}
      <span
        className={`dashboard-metric-change ${
          metric.change.startsWith("+")
            ? "dashboard-metric-change-positive"
            : "dashboard-metric-change-negative"
        }`}
      >
        {metric.change} from last period
      </span>
    </div>
  );
}

export default function MetricCards({ dateRange = "7d", currency = "DT" }: MetricCardsProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDashboardMetrics(dateRange).then((data) => {
      setMetrics([
        {
          label: "Total Users",
          value: data.totalUsers.value,
          change: "",
          icon: <User size={28} />,
          colorClass: "dashboard-metric-icon-blue",
        },
        {
          label: "New Users",
          value: data.newUsers.value,
          change: data.newUsers.change,
          icon: <User size={28} />,
          colorClass: "dashboard-metric-icon-cyan",
        },
        {
          label: "Sales",
          value: data.sales.value,
          change: data.sales.change,
          icon: <DollarSign size={28} />,
          colorClass: "dashboard-metric-icon-green",
          currency: true,
        },
        {
          label: "Total Orders",
          value: data.totalOrders?.value ?? 0,
          change: "",
          icon: <ShoppingCart size={28} />,
          colorClass: "dashboard-metric-icon-purple",
        },
        {
          label: "New Orders",
          value: data.newOrders?.value ?? 0,
          change: data.newOrders?.change ?? "",
          icon: <ShoppingCart size={28} />,
          colorClass: "dashboard-metric-icon-orange",
        },
        {
          label: "Active Sessions",
          value: data.sessions.value,
          change: data.sessions.change,
          icon: <Activity size={28} />,
          colorClass: "dashboard-metric-icon-pink",
        },
      ]);
      setLoading(false);
    });
  }, [dateRange]);

  if (loading) {
    return (
      <div className="dashboard-metric-cards-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="dashboard-metric-card dashboard-metric-card-loading" />
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-metric-cards-grid">
      {metrics.map((m) => (
        <MetricCard key={m.label} metric={m} currency={currency} />
      ))}
    </div>
  );
}