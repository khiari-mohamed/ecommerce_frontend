import React, { useEffect, useState } from "react";
import { fetchInvoices } from "@/services/invoices";
import PrintModal from "./PrintModal";
import BLPrintable from "./printables/BLPrintable";
import ReactDOM from "react-dom/client";
import orderService from "@/services/orders";



interface Bon {
  _id?: string;
  id?: string;
  numero_bl?: string;
  numero?: string;
  nom?: string;
  prenom?: string;
  created_at?: string;
}

const BLTab = () => {
  const [bons, setBons] = useState<Bon[]>([]);
  const [selected, setSelected] = useState<Bon | null>(null);
  const [fullBon, setFullBon] = useState<Bon | null>(null);
  const [loadingFullBon, setLoadingFullBon] = useState(false);

  useEffect(() => {
    fetchInvoices().then(data => setBons(data));
  }, []);

  // Fetch full bon when selected changes
  useEffect(() => {
    if (selected) {
      const fetchFull = async () => {
        setLoadingFullBon(true);
        try {
          const bonId = selected.id || selected._id;
          if (bonId) {
            const details = await orderService.fetchOrderById(bonId);
            setFullBon(details);
          } else {
            setFullBon(selected);
          }
        } catch {
          setFullBon(selected);
        } finally {
          setLoadingFullBon(false);
        }
      };
      fetchFull();
    } else {
      setFullBon(null);
    }
  }, [selected]);

  const handlePrint = async () => {
    if (!fullBon) return;

    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bon de Livraison</title>
            <link rel="stylesheet" type="text/css" href="/styles/style.css" />
            <link rel="stylesheet" type="text/css" href="/styles/print-correct.css" />
          </head>
          <body>
            <div id="print-root"></div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {
        const printRoot = printWindow.document.getElementById("print-root");
        if (printRoot) {
          ReactDOM.createRoot(printRoot).render(
            <BLPrintable order={fullBon} />
          );
        }
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 500);
      };
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bons de Livraison</h2>
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Numéro</th>
            <th className="p-2">Client</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bons.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-6">
                Aucun bon de livraison trouvé.
              </td>
            </tr>
          ) : (
            bons.map(bon => (
              <tr key={bon._id || bon.id} className="border-t">
                <td className="p-2">{bon.numero_bl || bon.numero}</td>
                <td className="p-2">{bon.nom} {bon.prenom}</td>
                <td className="p-2">{bon.created_at ? new Date(bon.created_at).toLocaleDateString("fr-FR") : ""}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => setSelected(bon)}
                  >
                    Voir / Imprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <PrintModal open={!!selected} onClose={() => { setSelected(null); setFullBon(null); }} onPrint={handlePrint}>
        {loadingFullBon ? (
          <div className="text-center text-gray-400 py-6">Chargement...</div>
        ) : (
          fullBon && <BLPrintable order={fullBon} />
        )}
      </PrintModal>
    </div>
  );
};

export default BLTab;