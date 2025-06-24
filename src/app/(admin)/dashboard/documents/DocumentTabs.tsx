"use client";
import React, { useState, useEffect } from "react";
import orderService from "@/services/orders";
import FactureClientList from "./FactureClientList";


import BonLivraisonList from "./BonLivraisonList";
import DevisList from "./DevisList";
import TicketDeCaisseList from "./TicketDeCaisseList";
import "../styles/dashboard.css"; // Adjust path as needed
import FactureDetail from "./FactureDetail";

type FactureType = "client" | "boutique" | "bon-commande";
interface Facture {
  id?: string;
  _id?: string;
  numero: string;
  type?: FactureType;
  created_at?: string;
  date?: string;
  total?: number;
  customer?: string;
  nom?: string;
  prenom?: string;
  // Add other fields as needed
}

const FactureList: React.FC = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [selected, setSelected] = useState<Facture | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | FactureType>("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    orderService
      .fetchOrders()
      .then((data) => {
        if (!cancelled) {
          // Map and normalize data
          let mapped = (data || []).map((f: any) => ({
            ...f,
            type: f.type || "client", // fallback for old data
          }));
          // Filter by type
          let filtered =
            filter === "all"
              ? mapped
              : mapped.filter((f: any) => f.type === filter);
          // Search filter
          if (search) {
            filtered = filtered.filter(
              (f: any) =>
                (f.numero || "")
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                `${f.nom || ""} ${f.prenom || ""}`.toLowerCase().includes(search.toLowerCase())
            );
          }
          setFactures(filtered);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Erreur lors du chargement des factures.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter, search]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fr-FR");
  };

  return (
    <div className="facture-table-root">
      <div className="flex gap-4 mb-4">
        <button
          className={`facture-table-filter-btn px-3 py-1 rounded ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          Tous
        </button>
        <button
          className={`facture-table-filter-btn px-3 py-1 rounded ${filter === "client" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("client")}
        >
          Facture Client
        </button>
        <input
          type="text"
          placeholder="Recherche numéro/client"
          className="facture-table-search ml-auto"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading && (
        <div className="text-center text-gray-500 py-8">Chargement des factures...</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-8">{error}</div>
      )}
      {!loading && !error && (
        <table className="facture-table w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Numéro</th>
              <th className="p-2">Type</th>
              <th className="p-2">Date</th>
              <th className="p-2">Client</th>
              <th className="p-2">Total</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {factures.length === 0 ? (
              <tr>
                <td colSpan={6} className="facture-table-empty">
                  Aucune facture trouvée.
                </td>
              </tr>
            ) : (
              factures.map(facture => (
                <tr key={facture.id || facture._id} className="border-t">
                  <td className="p-2">{facture.numero}</td>
                  <td className="p-2">
                    {facture.type === "client"
                      ? "Client"
                      : facture.type === "boutique"
                      ? "Boutique"
                      : facture.type === "bon-commande"
                      ? "Bon de Commande"
                      : facture.type}
                  </td>
                  <td className="p-2">{formatDate(facture.created_at || facture.date)}</td>
                  <td className="p-2">{facture.customer || `${facture.prenom || ""} ${facture.nom || ""}`}</td>
                  <td className="p-2">{facture.total ? `${facture.total} TND` : ""}</td>
                  <td className="p-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => setSelected(facture)}
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {selected && (
        <div className="facture-modal-overlay">
          <div className="facture-modal-content">
            <button
              className="facture-modal-close-btn"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <FactureDetail
              id={selected.id || selected._id || ""}
              onClose={() => setSelected(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Main tabbed dashboard
const DOC_TABS = [
  { key: "facture-client", label: "Facture Client" },
  { key: "bon-livraison", label: "Bons de Livraison" },
  { key: "devis", label: "Devis" },
  { key: "ticket", label: "Ticket de Caisse" },
];

const DocumentTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("facture");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="document-tabs-nav flex border-b mb-6">
        {DOC_TABS.map(tab => (
          <button
            key={tab.key}
            className={`document-tabs-btn py-2 px-4 font-semibold border-b-2 transition ${
              activeTab === tab.key
                ? "document-tabs-btn-active border-orange-500 text-orange-600"
                : "border-transparent text-gray-600 hover:text-orange-500"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div>
        {activeTab === "facture-client" && <FactureClientList />}
        {activeTab === "bon-livraison" && <BonLivraisonList />}
        {activeTab === "devis" && <DevisList />}
        {activeTab === "ticket" && <TicketDeCaisseList />}
      </div>
    </div>
  );
};

export default DocumentTabs;