import React from "react";
import ThemeToggleButton from "../components/common/ThemeToggleButton";
import { Bell, Menu } from "lucide-react";

export default function DashboardHeader({ onSidebarToggle }: { onSidebarToggle?: () => void }) {
  return (
    <header className="dashboard-header">
      {/* Left: Hamburger for mobile + Page Title */}
      <div className="dashboard-header-title-wrap">
        <button
          className="dashboard-header-hamburger md:hidden"
          aria-label="Open sidebar"
          onClick={onSidebarToggle}
          style={{ marginRight: 12 }}
        >
          <Menu size={28} />
        </button>
        <span className="dashboard-header-title">Dashboard</span>
      </div>
      {/* Right: Actions */}
      <div className="dashboard-header-actions">
        <button className="dashboard-header-bell">
          <Bell size={22} className="dashboard-header-bell-icon" />
          <span className="dashboard-header-bell-dot"></span>
        </button>
        <ThemeToggleButton />
        <div className="dashboard-header-avatar">A</div>
      </div>
    </header>
  );
}