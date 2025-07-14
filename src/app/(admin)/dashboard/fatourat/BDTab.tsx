import React, { useEffect, useState } from "react";
import { fetchInvoices } from "@/services/invoices";
import PrintModal from "./PrintModal";
import BDCPrintable from "./printables/BDCPrintable";
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

const BDTab = () => {
  const [bons, setBons] = useState<Bon[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [fullBDC, setFullBDC] = useState<any | null>(null);
  const [loadingFullBDC, setLoadingFullBDC] = useState(false);

  useEffect(() => {
    fetchInvoices().then(data => setBons(data));
  }, []);

  // Fetch full bon de commande when selected changes
  useEffect(() => {
    if (selected) {
      const fetchFull = async () => {
        setLoadingFullBDC(true);
        try {
          const bdcId = selected.id || selected._id;
          if (bdcId) {
            const details = await orderService.fetchOrderById(bdcId);
            setFullBDC(details);
          } else {
            setFullBDC(selected);
          }
        } catch {
          setFullBDC(selected);
        } finally {
          setLoadingFullBDC(false);
        }
      };
      fetchFull();
    } else {
      setFullBDC(null);
    }
  }, [selected]);

  const handlePrint = async () => {
    if (!fullBDC) return;
    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bon de Commande</title>
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
            <BDCPrintable order={fullBDC} />
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
      <h2 className="text-2xl font-bold mb-4">Bons de Commande</h2>
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
                Aucun bon de commande trouvé.
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
      <PrintModal open={!!selected} onClose={() => { setSelected(null); setFullBDC(null); }} onPrint={handlePrint}>
        {loadingFullBDC ? (
          <div className="text-center text-gray-400 py-6">Chargement...</div>
        ) : (
          fullBDC && <BDCPrintable order={fullBDC} />
        )}
      </PrintModal>
    </div>
  );
};

export default BDTab;