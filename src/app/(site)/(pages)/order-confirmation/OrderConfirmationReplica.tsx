import React from "react";
import Image from "next/image";

const OrderConfirmationReplica = ({ order, onShowOriginal }) => {
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-2 text-center">
        <Image src="/images/logo/logo.png" alt="Logo" width={96} height={96} className="h-16 w-24 sm:h-20 sm:w-32 object-contain mb-4" loading="lazy" sizes="96px" />
        <div className="text-lg text-blue-700 font-bold mb-2">Chargement de votre commande...</div>
        <div className="text-gray-500 text-sm">Veuillez patienter.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/logo/logo.png" alt="Logo" width={120} height={60} className="mb-2" />
          <h1 className="text-2xl font-bold text-green-700 mb-2">Merci pour votre commande !</h1>
          <p className="text-gray-600 text-center">Votre commande a été reçue et est en cours de traitement.</p>
        </div>
        {/* Order summary */}
        <div className="text-gray-700 text-sm text-center mb-6">
          <p>Numéro de commande : <span className="font-bold">{order.numero}</span></p>
          <p>Date : <span className="font-bold">{order.created_at ? new Date(order.created_at).toLocaleString("fr-FR") : "-"}</span></p>
          <p>Nom : <span className="font-bold">{order.prenom} {order.nom}</span></p>
          <p>Email : <span className="font-bold">{order.email}</span></p>
          <p>Téléphone : <span className="font-bold">{order.phone}</span></p>
        </div>
        {/* Products */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Produits commandés</h2>
          <ul className="divide-y divide-gray-200">
            {(order.cart || order.products || order.items || []).map((item, idx) => (
              <li key={idx} className="py-2 flex justify-between items-center">
                <span>{item.title || item.name || item.product_name || "Produit"} x {item.quantity ?? item.qty ?? 1}</span>
                <span className="font-semibold">{Number(item.price ?? item.unit_price ?? 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Total */}
        <div className="mb-8 text-right">
          <span className="font-bold text-base">Total : {Number(order.prix_ttc || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
        </div>
        {/* Toggle button */}
        <div className="my-8 text-center">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            onClick={onShowOriginal}
          >
            Afficher l’ancienne version (tous les détails, factures, modals)
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationReplica;
