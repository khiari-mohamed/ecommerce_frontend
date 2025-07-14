import React, { useEffect, useState } from "react";
import { fetchInvoices } from "@/services/invoices";
import PrintModal from "./PrintModal";
import TKPrintable from "./printables/TKPrintable";
import ReactDOM from "react-dom/client";

interface Ticket {
  _id?: string;
  id?: string;
  numero?: string;
  created_at?: string;
  prix_ttc?: number;
  total?: number;
}

const TKTab = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchInvoices().then(data => setTickets(data));
  }, []);

  const handlePrint = () => {
    if (!selected) return;
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (printWindow) {
      printWindow.document.write(`
  <html>
    <head>
      <title>Ticket de Caisse</title>
      <link rel="stylesheet" type="text/css" href="/styles/print-ticket.css" />
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
            <TKPrintable order={selected} />
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
      <h2 className="text-2xl font-bold mb-4">Tickets de caisse</h2>
      <table className="w-full border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Numéro</th>
            <th className="p-2">Date</th>
            <th className="p-2">Total</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-6">
                Aucun ticket trouvé.
              </td>
            </tr>
          ) : (
            tickets.map(ticket => (
              <tr key={ticket._id || ticket.id} className="border-t">
                <td className="p-2">{ticket.numero || ticket._id || ticket.id}</td>
                <td className="p-2">{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString("fr-FR") : ""}</td>
                <td className="p-2">{ticket.prix_ttc || ticket.total} TND</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => setSelected(ticket)}
                  >
                    Voir / Imprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <PrintModal open={!!selected} onClose={() => setSelected(null)} onPrint={handlePrint}>
        {selected && <TKPrintable order={selected} />}
      </PrintModal>
    </div>
  );
};

export default TKTab;