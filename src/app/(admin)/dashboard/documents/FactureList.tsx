import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import FactureDetail from "./FactureDetail";
import "../styles/dashboard.css";

type FactureType = "client" | "boutique" | "bon-commande";
interface Facture {
  _id: string;
  numero: string;
  type?: FactureType;
  date: string;
  total: number;
  customer: string;
}

const FactureList = () => {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [selected, setSelected] = useState<Facture | null>(null);
  const [filter, setFilter] = useState<"all" | FactureType>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params: any = {};
    if (search) params.search = search;

    axios
      .get("/commande", { params })
      .then((res) => {
        if (!cancelled) {
          const mapped = (res.data || []).map((order: any) => ({
            _id: order._id || order.id,
            numero: order.numero,
            type: order.type || "client", // fallback for old data
            date: order.created_at,
            total: Number(order.prix_ttc),
            customer: (order.nom ? order.nom : "") + " " + (order.prenom ? order.prenom : ""),
          }));
          const filtered =
            filter === "all"
              ? mapped
              : mapped.filter(f => f.type === filter);
          setFactures(filtered);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError("Erreur lors du chargement des factures.");
          console.error("Erreur lors du chargement des factures:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter, search]);

  return (
    <div className="facture-table-root">
      <div className="flex gap-4 mb-4">
        <button
          className={`facture-table-filter-btn px-3 py-1 rounded ${filter === "all" ? "facture-table-filter-btn-active bg-orange-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          Tous
        </button>
        <button
          className={`facture-table-filter-btn px-3 py-1 rounded ${filter === "client" ? "facture-table-filter-btn-active bg-orange-500 text-white" : "bg-gray-200"}`}
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
        <table className="facture-table w-full border mb-6">
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
                <tr key={facture._id} className="border-t">
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
                  <td className="p-2">{facture.date}</td>
                  <td className="p-2">{facture.customer}</td>
                  <td className="p-2">{facture.total} TND</td>
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
            <FactureDetail id={selected._id} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FactureList;