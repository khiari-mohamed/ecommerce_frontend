
import React, { useEffect, useState } from "react";
import orderService from "@/services/orders";
import DevisDetail from "./DevisDetail";
import "../styles/dashboard.css";
import "../styles/print.css";

const DevisList: React.FC = () => {
  const [devis, setDevis] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    orderService
      .fetchOrders()
      .then((data) => {
        setDevis(data);
      })
      .catch(() => setDevis([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredDevis = devis.filter(
    (d) =>
      (d.numero_devis || d.numero || "").toLowerCase().includes(search.toLowerCase()) ||
      `${d.nom || ""} ${d.prenom || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Recherche par numéro, client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-full max-w-md"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement en cours...</div>
      ) : filteredDevis.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun devis trouvé</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Numéro</th>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-right">Total</th>
                <th className="p-2 text-left">Statut</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevis.map((d) => (
                <tr key={d._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{d.numero_devis || d.numero}</td>
                  <td className="p-2">{d.prenom} {d.nom}</td>
                  <td className="p-2">
                    {d.created_at ? new Date(d.created_at).toLocaleDateString("fr-FR") : ""}
                  </td>
                  <td className="p-2 text-right">
                    {Number(d.prix_ttc || 0).toLocaleString("fr-TN", {
                      style: "currency",
                      currency: "TND"
                    })}
                  </td>
                  <td className="p-2">{d.etat || "En attente"}</td>
                  <td className="p-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedId(d._id)}
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedId && (
        <div className="devis-modal-overlay">
          <div className="devis-modal-content">
            <button
              onClick={() => setSelectedId(null)}
              className="devis-modal-close-btn no-print"
              aria-label="Fermer"
            >
              ×
            </button>
            <DevisDetail id={selectedId} onClose={() => setSelectedId(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DevisList;
