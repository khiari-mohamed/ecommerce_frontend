import React, { useEffect, useState } from "react";
import { fetchInvoices } from "@/services/invoices";
import PrintModal from "./PrintModal";
import DVPrintable from "./printables/DVPrintable";
import ReactDOM from "react-dom/client";
import orderService from "@/services/orders"; // Make sure this is imported

interface Devis {
  _id?: string;
  id?: string;
  numero_devis?: string;
  numero?: string;
  client?: { name?: string };
  nom?: string;
  date?: string;
  total?: number;
  prix_ttc?: number;
}

const DevisTab = () => {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [fullDevis, setFullDevis] = useState<any | null>(null);
  const [loadingFullDevis, setLoadingFullDevis] = useState(false);

  useEffect(() => {
    fetchInvoices().then(data => setDevis(data));
  }, []);

  useEffect(() => {
    if (selected) {
      const fetchFull = async () => {
        setLoadingFullDevis(true);
        try {
          const devisId = selected.id || selected._id;
          if (devisId) {
            const details = await orderService.fetchOrderById(devisId);
            setFullDevis(details);
          } else {
            setFullDevis(selected);
          }
        } catch {
          setFullDevis(selected);
        } finally {
          setLoadingFullDevis(false);
        }
      };
      fetchFull();
    } else {
      setFullDevis(null);
    }
  }, [selected]);

  const handlePrint = () => {
    if (!fullDevis) return;
    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Devis</title>
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
            <DVPrintable order={fullDevis} />
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
      <h2 className="text-2xl font-bold mb-4">Devis</h2>
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Numéro</th>
            <th className="p-2">Client</th>
            <th className="p-2">Date</th>
            <th className="p-2">Total</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devis.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-6">
                Aucun devis trouvé.
              </td>
            </tr>
          ) : (
            devis.map(dv => (
              <tr key={dv._id || dv.id} className="border-t">
                <td className="p-2">{dv.numero_devis || dv.numero}</td>
                <td className="p-2">{dv.client?.name || dv.nom || ""}</td>
                <td className="p-2">{dv.date ? new Date(dv.date).toLocaleDateString("fr-FR") : ""}</td>
                <td className="p-2">{dv.total || dv.prix_ttc} TND</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => setSelected(dv)}
                  >
                    Voir / Imprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <PrintModal open={!!selected} onClose={() => { setSelected(null); setFullDevis(null); }} onPrint={handlePrint}>
        {loadingFullDevis ? (
          <div className="text-center text-gray-400 py-6">Chargement...</div>
        ) : (
          fullDevis && <DVPrintable order={fullDevis} />
        )}
      </PrintModal>
    </div>
  );
};

export default DevisTab;