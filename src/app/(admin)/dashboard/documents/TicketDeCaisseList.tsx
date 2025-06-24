import React, { useEffect, useState } from "react";
import orderService from "@/services/orders";
import TicketDeCaisseDetail from "./TicketDeCaisseDetail";
import "../styles/dashboard.css";

const TicketDeCaisseList: React.FC = () => {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    orderService
      .fetchOrders()
      .then((data) => setCommandes(data))
      .catch(() => setCommandes([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredCommandes = commandes.filter(
    (c) =>
      (c.numero || c._id || "").toLowerCase().includes(search.toLowerCase()) ||
      `${c.nom || ""} ${c.prenom || ""}`.toLowerCase().includes(search.toLowerCase())
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
      ) : filteredCommandes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucune commande trouvée</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Numéro</th>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-right">Total</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommandes.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{c.numero || c._id}</td>
                  <td className="p-2">{c.prenom} {c.nom}</td>
                  <td className="p-2">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : ""}
                  </td>
                  <td className="p-2 text-right">
                    {Number(c.prix_ttc || c.total || 0).toLocaleString("fr-TN", {
                      style: "currency",
                      currency: "TND"
                    })}
                  </td>
                  <td className="p-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedId(c._id)}
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
        <div className="ticket-modal-overlay">
          <div className="ticket-modal-content">
            <button
              onClick={() => setSelectedId(null)}
              className="ticket-modal-close-btn no-print"
              aria-label="Fermer"
            >
              ×
            </button>
            <TicketDeCaisseDetail id={selectedId} onClose={() => setSelectedId(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDeCaisseList;