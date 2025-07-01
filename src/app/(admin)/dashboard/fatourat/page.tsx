"use client"
import React from "react";
import FDTabs from "./FDTabs";
//import "./styles/print-correct.css";
import "../styles/dashboard.css";
const FDPage = () => (
  <div className="fd-root" style={{ marginLeft: 260, padding: "2rem" }}>
    <h1 className="text-3xl font-bold mb-8"> (FD - Nouveau)</h1>
    <FDTabs />
  </div>
);

export default FDPage;