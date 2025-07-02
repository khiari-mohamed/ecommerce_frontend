"use client";
import React, { useState } from "react";
import DashboardSidebar from "./layout/DashboardSidebar";
import DashboardHeader from "./layout/DashboardHeader";
import { AuthProvider } from "./context/AuthContext";
import Script from "next/script";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // For overlay click on mobile
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleSidebarToggle = () => setSidebarOpen((v) => !v);

  return (
    <AuthProvider>
      {/* Google Analytics for dashboard */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0J0J27JZ7D"
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0J0J27JZ7D');
          `,
        }}
      />
      <div className="dashboard-layout">
        {/* Sidebar: always visible on desktop, toggled on mobile */}
        <DashboardSidebar open={sidebarOpen} onClose={handleSidebarClose} />
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="dashboard-sidebar-overlay md:hidden"
            onClick={handleSidebarClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              zIndex: 40,
            }}
          />
        )}
        <div className="dashboard-layout-main">
          <DashboardHeader onSidebarToggle={handleSidebarToggle} />
          <main className="dashboard-layout-content">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
};

export default DashboardLayout;