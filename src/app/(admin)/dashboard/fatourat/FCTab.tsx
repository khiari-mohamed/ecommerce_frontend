import React, { useEffect, useState } from "react";
import { fetchInvoices } from "@/services/invoices";
import PrintModal from "./PrintModal";
import FactureClientPrintable from "./printables/FCPrintable";
import FactureBoutiquePrintable from "./printables/FBPrintable";
//import "./styles/print-correct.css";
import ReactDOM from "react-dom/client";
import orderService from "@/services/orders"; // Make sure this is imported

const subTabs = [
  { key: "client", label: "Facture Client" },
  { key: "boutique", label: "Facture Boutique" },
];

interface Facture {
  _id?: string;
  id?: string;
  invoiceNumber?: string;
  numero?: string;
  client?: { name?: string };
  nom?: string;
  date?: string;
  total?: number;
  prix_ttc?: number;
}

const FactureTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("client");
  const [invoices, setInvoices] = useState<Facture[]>([]);
  // Store both the selected invoice and the sub-tab at the time of selection
  const [selected, setSelected] = useState<{ invoice: Facture, tab: string } | null>(null);
  const [fullInvoice, setFullInvoice] = useState<any | null>(null);
  const [loadingFullInvoice, setLoadingFullInvoice] = useState(false);

  useEffect(() => {
    fetchInvoices().then(data => {
      console.log("Fetched invoices:", data);
      setInvoices(data);
    });
  }, []);

  useEffect(() => {
    if (selected) {
      const fetchFull = async () => {
        setLoadingFullInvoice(true);
        try {
          const invId = selected.invoice.id || selected.invoice._id;
          if (invId) {
            const details = await orderService.fetchOrderById(invId);
            setFullInvoice(details);
          } else {
            setFullInvoice(selected.invoice);
          }
        } catch {
          setFullInvoice(selected.invoice);
        } finally {
          setLoadingFullInvoice(false);
        }
      };
      fetchFull();
    } else {
      setFullInvoice(null);
    }
  }, [selected]);

  const filtered = invoices;

  const handlePrint = () => {
    if (!fullInvoice) return;
    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (printWindow) {
      printWindow.document.write(`
      <html>
      <head>
      <title>Facture</title>
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
        if (printRoot && selected) {
          ReactDOM.createRoot(printRoot).render(
            selected.tab === "client"
              ? <FactureClientPrintable order={fullInvoice} />
              : <FactureBoutiquePrintable order={fullInvoice} />
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
      <h2 className="text-2xl font-bold mb-4">Factures</h2>
      <div className="flex gap-2 mb-4">
        {subTabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded font-semibold transition ${
              activeSubTab === tab.key
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-orange-100"
            }`}
            onClick={() => setActiveSubTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
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
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-6">
                Aucune facture trouvée.
              </td>
            </tr>
          ) : (
            filtered.map(inv => (
              <tr key={inv._id || inv.id} className="border-t">
                <td className="p-2">{inv.invoiceNumber || inv.numero}</td>
                <td className="p-2">{inv.client?.name || inv.nom || ""}</td>
                <td className="p-2">{inv.date ? new Date(inv.date).toLocaleDateString("fr-FR") : ""}</td>
                <td className="p-2">{inv.total || inv.prix_ttc} TND</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => setSelected({ invoice: inv, tab: activeSubTab })}
                  >
                    Voir / Imprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <PrintModal open={!!selected} onClose={() => { setSelected(null); setFullInvoice(null); }} onPrint={handlePrint}>
        {loadingFullInvoice ? (
          <div className="text-center text-gray-400 py-6">Chargement...</div>
        ) : (
          fullInvoice && selected &&
          (selected.tab === "client"
            ? <FactureClientPrintable order={fullInvoice} />
            : <FactureBoutiquePrintable order={fullInvoice} />)
        )}
      </PrintModal>
    </div>
  );
};

export default FactureTab;