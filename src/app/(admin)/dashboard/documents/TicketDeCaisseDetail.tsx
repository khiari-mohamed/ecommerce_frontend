import React, { useEffect, useRef, useState } from "react";
import TicketDeCaisse from "./TicketDeCaisse";
import orderService from "@/services/orders";
import { useReactToPrint } from "react-to-print";
import "../styles/dashboard.css"; // Adjust path as needed

interface TicketDeCaisseDetailProps {
  id: string;
  onClose: () => void;
}

const TicketDeCaisseDetail: React.FC<TicketDeCaisseDetailProps> = ({ id, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [commande, setCommande] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    orderService
      .fetchOrderById(id)
      .then((data) => setCommande(data))
      .catch(() => setError("Erreur lors du chargement de la commande."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBasicPrint = () => {
  const printContents = printRef.current?.innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');

  if (printWindow && printContents) {
    printWindow.document.write('<html><head><title>Ticket</title>');
    printWindow.document.write('<style>@page { size: auto; margin: 10mm; } body { font-family: sans-serif; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};


  if (loading) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {error}
        <button 
          className="ml-4 px-3 py-1 bg-gray-200 rounded" 
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    );
  }

  if (!commande) {
    return <div className="p-4">Commande introuvable.</div>;
  }

  // Map commande/order data to TicketDeCaisse props
  const items = Array.isArray(commande.cart)
    ? commande.cart.map((item: any) => ({
        name: item.title || item.name || "Produit",
        qty: item.quantity ?? item.qty ?? 1,
        price: Number(item.price ?? 0) * (item.quantity ?? item.qty ?? 1),
      }))
    : [];

  const total = Number(commande.prix_ttc || commande.total || 0);
  const remise = Number(commande.remise || 0);
  const remisePourcentage = Number(commande.remise_pourcentage || commande.remisePourcentage || 0);
  const totalHT = Number(commande.prix_ht || commande.total_ht || 0);

    function handlePrint(event: React.MouseEvent<HTMLButtonElement>): void {
        handleBasicPrint();
    }

  return (
    <div className="ticket-modal-overlay">
      <div className="ticket-modal-content">
        <button
          onClick={onClose}
          className="ticket-modal-close-btn no-print"
          aria-label="Fermer"
        >
          ×
        </button>
        <div ref={printRef}>
          <TicketDeCaisse
            ticketNumber={commande.numero || commande._id || ""}
            date={
              commande.created_at
                ? new Date(commande.created_at).toLocaleString("fr-FR")
                : ""
            }
            items={items}
            total={total}
            remise={remise}
            remisePourcentage={remisePourcentage}
            totalHT={totalHT}
            footer={undefined}
            logoUrl={undefined}
          />
        </div>
        <div className="mt-4 flex gap-2 no-print" style={{ justifyContent: "center" }}>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600"
          >
            Imprimer / Exporter PDF
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDeCaisseDetail;