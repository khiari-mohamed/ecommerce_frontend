import React from "react";
import DashboardSidebar from "./layout/DashboardSidebar";
import DashboardHeader from "./layout/DashboardHeader";
import { AuthProvider } from "./context/AuthContext";
import Script from "next/script"; 

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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
        <DashboardSidebar />
        <div className="dashboard-layout-main">
          <DashboardHeader />
          <main className="dashboard-layout-content">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
};

export default DashboardLayout;