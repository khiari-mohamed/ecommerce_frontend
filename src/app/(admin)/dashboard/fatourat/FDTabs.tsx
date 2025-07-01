import React, { useState } from "react";
import FCTab from "./FCTab";
import BDTab from "./BDTab";
import BLTab from "./BLTab";
import DVTab from "./DVTab";
import TKTab from "./TK";

const tabs = [
  { key: "fc", label: "Facture Client" },
  { key: "bdc", label: "Bon de Commande" },
  { key: "bl", label: "Bon de Livraison" },
  { key: "dv", label: "Devis" },
  { key: "tk", label: "Ticket de caisse" },
];

const FDTabs = () => {
  const [activeTab, setActiveTab] = useState("fc");

  return (
    <div>
      <div className="fdtab-bar flex border-b-2 border-gray-200 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`fdtab-btn px-6 py-3 font-bold text-lg transition-all duration-200
              ${activeTab === tab.key
                ? "text-orange-600 border-b-4 border-orange-500 bg-orange-50"
                : "text-gray-600 border-b-4 border-transparent hover:bg-gray-100"
              }`}
            style={{
              outline: "none",
              borderRadius: 0,
              marginRight: 8,
              marginBottom: -2,
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "fc" && <FCTab />}
        {activeTab === "dv" && <DVTab />}
        {activeTab === "bl" && <BLTab />}
        {activeTab === "bdc" && <BDTab />}
        {activeTab === "tk" && <TKTab />}
      </div>
    </div>
  );
};

export default FDTabs;