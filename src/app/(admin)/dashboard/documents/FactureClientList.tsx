import React, { useState, useEffect } from "react";
import orderService from "@/services/orders";
import FactureClientDocument from "./FactureClientDocument";
import "../styles/dashboard.css";
import "../styles/print.css";

const FactureClientList: React.FC = () => {
  const [factures, setFactures] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    orderService
      .fetchOrders({ type: "all" })
      .then((data) => {
        if (!cancelled) {
          let mapped = (data || []).map((f: any) => ({
            ...f,
            type: f.type || "client",
          }));
          let filtered = mapped.filter((f: any) => f.type === "client");
          if (search) {
            filtered = filtered.filter(
              (f: any) =>
                (f.numero || "").toLowerCase().includes(search.toLowerCase()) ||
                `${f.nom || ""} ${f.prenom || ""}`.toLowerCase().includes(search.toLowerCase())
            );
          }
          setFactures(filtered);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Erreur lors du chargement des factures client.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [search]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fr-FR");
  };

  return (
    <div className="facture-table-root">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Recherche numéro/client"
          className="facture-table-search ml-auto"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading && (
        <div className="text-center text-gray-500 py-8">Chargement des factures client...</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-8">{error}</div>
      )}
      {!loading && !error && (
        <table className="facture-table w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Numéro</th>
              <th className="p-2">Date</th>
              <th className="p-2">Client</th>
              <th className="p-2">Total</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {factures.length === 0 ? (
              <tr>
                <td colSpan={5} className="facture-table-empty">
                  Aucune facture client trouvée.
                </td>
              </tr>
            ) : (
              factures.map(facture => (
                <tr key={facture.id || facture._id} className="border-t">
                  <td className="p-2">{facture.numero}</td>
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
        <FactureClientModal order={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

// Modal with print logic
import { useRef } from "react";
const FactureClientModal: React.FC<{ order: any; onClose: () => void }> = ({ order, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Facture Client</title>
            <link rel="stylesheet" type="text/css" href="/styles/dashboard.css" />
          </head>
          <body>
            <div class="facture-modal-content">${printContents}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };
  return (
    <div className="facture-modal-overlay">
      <div className="facture-modal-content">
        <button className="facture-modal-close-btn" onClick={onClose}>×</button>
        <div ref={printRef}>
          <FactureClientDocument order={order} printRef={printRef} />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600"
          >
            Imprimer / Exporter PDF
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FactureClientList;
