"use client";
import React, { useState } from "react";
import "../styles/dashboard.css";
import FactureBoutiqueList from "./FactureBoutiqueList";
import BonDeCommandeList from "./BonDeCommandeList";

const FactureDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<"facture" | "bon">("facture");

  return (
    <div className="facture-main-container">
      <h1 className="text-3xl font-bold mb-8">Factures & Bons de Commande</h1>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold transition ${
            activeTab === "facture"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-orange-100"
          }`}
          onClick={() => setActiveTab("facture")}
        >
          Factures Boutique
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition ${
            activeTab === "bon"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-orange-100"
          }`}
          onClick={() => setActiveTab("bon")}
        >
          Bons de Commande
        </button>
      </div>
      <div>
        {activeTab === "facture" ? <FactureBoutiqueList /> : <BonDeCommandeList />}
      </div>
    </div>
  );
};

export default FactureDashboardPage;