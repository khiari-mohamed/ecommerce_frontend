import React from "react";
import ThemeToggleButton from "../components/common/ThemeToggleButton";
import { Bell } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="dashboard-header">
      {/* Left: Page Title */}
      <div className="dashboard-header-title-wrap">
        <span className="dashboard-header-title">
          Dashboard
        </span>
      </div>

      {/* Right: Actions */}
      <div className="dashboard-header-actions">
        {/* Notification Bell */}
        <button className="dashboard-header-bell">
          <Bell size={22} className="dashboard-header-bell-icon" />
          <span className="dashboard-header-bell-dot"></span>
        </button>
        {/* Theme Toggle */}
        <ThemeToggleButton />
        {/* Avatar */}
        <div className="dashboard-header-avatar">
          A
        </div>
      </div>
    </header>
  );
}