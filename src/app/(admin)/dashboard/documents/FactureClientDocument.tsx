import React from "react";
import "../styles/print.css";
import Image from "next/image";

interface FactureClientDocumentProps {
  order: any;
  printRef: React.RefObject<HTMLDivElement | null>;
}

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "sobitas",
  email: "contact@protein.tn",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+216 73 200 169"
};

const ORANGE = "#FF4301";

const FactureClientDocument: React.FC<FactureClientDocumentProps> = ({ order, printRef }) => {
  if (!order) return null;

  // DEBUG: Log the order object to inspect cart structure
  console.log('FactureClientDocument order:', order);

  const client = {
    nom: order.nom || "",
    prenom: order.prenom || "",
    adresse1: order.adresse1 || "",
    adresse2: order.adresse2 || "",
    ville: order.ville || "",
    code_postale: order.code_postale || "",
    pays: order.pays || "",
    email: order.email || "",
    phone: order.phone || "",
  };

  const dateFacture = order.created_at
    ? new Date(order.created_at).toLocaleDateString("fr-FR")
    : "";

  const cart = Array.isArray(order.cart) ? order.cart : [];

  return (
    <div ref={printRef} className="facture-document-print-area bg-white py-8 px-1 font-sans print:py-0 print:px-0">
      <div className="facture-document-root max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 relative border border-blue-200 print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col items-start">
            <Image src={COMPANY.logo} alt="Logo" width={48} height={48} className="h-12 mb-1" loading="lazy" />
            <div className="text-[11px] text-gray-700 leading-tight">
              <div className="mb-0.5 font-bold">{COMPANY.name}</div>
              <div className="mb-0.5">{COMPANY.address}</div>
              <div>{COMPANY.email}</div>
              <div>{COMPANY.tel}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-extrabold text-right" style={{ color: ORANGE, letterSpacing: "1px" }}>
              FACTURE CLIENT
            </span>
            <span className="text-[11px] text-gray-500 mt-2">
              Date de la facture : {dateFacture}
            </span>
            <span className="text-[11px] text-gray-500">
              N° : <span className="font-semibold">{order.numero}</span>
            </span>
          </div>
        </div>
        {/* Orange thin line */}
        <div className="w-full h-0.5 mb-4" style={{ background: ORANGE, borderRadius: 2 }} />
        {/* Client Info */}
        <div className="mb-4">
          <div className="font-semibold text-[13px] text-blue-700 mb-1">Client</div>
          <div className="text-[11px] text-gray-700 leading-tight">
            <div>{client.prenom} {client.nom}</div>
            <div>{client.adresse1}</div>
            {client.adresse2 && <div>{client.adresse2}</div>}
            <div>{client.ville}{client.code_postale ? `, ${client.code_postale}` : ""}</div>
            <div>{client.pays}</div>
            <div>Email : {client.email}</div>
            <div>Tél : {client.phone}</div>
          </div>
        </div>
        {/* Products Table */}
        <div className="overflow-x-auto mb-6">
          <table className="facture-table w-full border rounded-lg overflow-hidden shadow-sm text-[12px]">
            <thead>
              <tr className="bg-[#FF4301] text-white">
                <th className="p-1 text-left font-semibold">Produit</th>
                <th className="p-1 text-right font-semibold">Quantité</th>
                <th className="p-1 text-right font-semibold">PU</th>
                <th className="p-1 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item: any, idx: number) => (
                  <tr key={idx} className="border-t hover:bg-orange-50">
                    <td className="p-1">{item.title || item.name || item.product_name || "Produit"}</td>
                    <td className="p-1 text-right">{item.quantity ?? item.qty ?? 1}</td>
                    <td className="p-1 text-right">{Number(item.price ?? 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                    <td className="p-1 text-right">{Number((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-2">
                    Aucun produit trouvé dans cette facture.<br />
                    <span className="text-xs text-red-400">Vérifiez la structure de la commande dans la console.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Totals */}
        <div className="flex flex-col items-end space-y-1 mb-6 text-[12px]">
          <div className="flex justify-between w-56">
            <span className="font-medium">Total HT :</span>
            <span>{Number(order.prix_ht || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
          </div>
          <div className="flex justify-between w-56">
            <span className="font-medium">TVA :</span>
            <span>{Number(order.tva || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
          </div>
          <div className="flex justify-between w-56 border-t pt-2">
            <span className="font-bold">Total TTC :</span>
            <span className="font-bold" style={{ color: ORANGE }}>
              {Number(order.prix_ttc || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
            </span>
          </div>
        </div>
        {/* Signature */}
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col items-start">
            <div className="h-12 border-b border-gray-400 w-32 mb-1" />
            <span className="text-[11px] text-gray-500">Signature du client</span>
          </div>
        </div>
        {/* Footer */}
        <div className="text-[10px] text-gray-400 mt-6 text-center border-t pt-3">
          &copy; {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
        </div>
      </div>
    </div>
  );
};

export default FactureClientDocument;
