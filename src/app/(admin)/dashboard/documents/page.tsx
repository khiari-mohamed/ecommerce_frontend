"use client";
import DocumentTabs from "./DocumentTabs";
import "../styles/dashboard.css";

export default function DocumentsPage() {
  return (
    <div className="dashboard-content-wrapper">
      <DocumentTabs />
    </div>
  );
}