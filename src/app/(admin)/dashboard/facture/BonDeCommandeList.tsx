"use client";
import React, { useEffect, useState } from "react";
import { fetchOrders } from "@/services/orders";
import BonDeCommandeDocument from "./BonDeCommandeDocument";
import BonDeCommandeModal from "./BonDeCommandeModal";
import "./facture.css";

const BonDeCommandeList = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bons de Commande</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2 border">N°</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Total TTC</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id || order._id}>
                <td className="p-2 border">{order.numero}</td>
                <td className="p-2 border">{order.nom} {order.prenom}</td>
                <td className="p-2 border">{new Date(order.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="p-2 border">{Number(order.prix_ttc).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                <td className="p-2 border">
                  <button
                    className="bg-orange-500 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Voir / Imprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BonDeCommandeModal open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <>
            <BonDeCommandeDocument order={selectedOrder} />
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => window.print()}
              >
                Imprimer
              </button>
            </div>
          </>
        )}
      </BonDeCommandeModal>
    </div>
  );
};

export default BonDeCommandeList;