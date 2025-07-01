"use client";
import React, { useState, useEffect } from "react";
import orderService from "@/services/orders";
import BonLivraisonDetail from "./BonLivraisonDetail";
import "../styles/dashboard.css"; // Adjust path as needed
import "../styles/print.css";

interface BonLivraison {
  id?: string;
  _id?: string;
  numero_bl?: string;
  numero?: string;
  created_at?: string;
  date_livraison?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  etat?: string;
  // Add other fields as needed
}

const BonLivraisonList: React.FC = () => {
  const [bons, setBons] = useState<BonLivraison[]>([]);
  const [selected, setSelected] = useState<BonLivraison | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    orderService
      .fetchOrders()
      .then((data) => {
        if (!cancelled) {
          setBons(data); // Show all orders, no filter
        }
      })
      .catch(() => {
        if (!cancelled) setError("Erreur lors du chargement des bons de livraison.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Search filter (client-side)
  const filteredBons = bons.filter(
    (b) =>
      (b.numero_bl || b.numero || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      `${b.nom || ""} ${b.prenom || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  // Helper for date formatting
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fr-FR");
  };

  return (
    <div className="dashboard-container">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Recherche numéro/client"
          className="px-2 py-1 border rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading && (
        <div className="text-center text-gray-500 py-8">Chargement des bons de livraison...</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-8">{error}</div>
      )}
      {!loading && !error && (
        <table className="w-full border mb-6 force-orders-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Numéro BL</th>
              <th className="p-2">Date Commande</th>
              <th className="p-2">Date Livraison</th>
              <th className="p-2">Client</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBons.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">
                  Aucun bon de livraison trouvé.
                </td>
              </tr>
            ) : (
              filteredBons.map(bon => (
                <tr key={bon.id || bon._id} className="border-t">
                  <td className="p-2">{bon.numero_bl || bon.numero}</td>
                  <td className="p-2">{formatDate(bon.created_at)}</td>
                  <td className="p-2">{formatDate(bon.date_livraison)}</td>
                  <td className="p-2">{bon.prenom} {bon.nom}</td>
                  <td className="p-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => setSelected(bon)}
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
  <div className="bonlivraison-detail-modal-overlay">
    <div className="bonlivraison-detail-modal-content">
      <button
        className="facture-modal-close-btn"
        onClick={() => setSelected(null)}
        aria-label="Fermer"
      >
        ×
      </button>
      <BonLivraisonDetail
        id={selected.id || selected._id || ""}
        onClose={() => setSelected(null)}
      />
    </div>
  </div>
)}
    </div>
  );
};

export default BonLivraisonList;