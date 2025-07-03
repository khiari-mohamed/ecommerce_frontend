import { QRCode } from "react-qrcode-logo";
import Image from "next/image";

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "sobitas",
  email: "contact@protein.tn",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+216 73 200 169"
};

const ORANGE = "#FF4301";

const BonLivraisonDocument = ({ order, printRef }) => {
  const cart = Array.isArray(order.cart) ? order.cart : [];
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
  const delivery = {
    nom: order.livraison_nom || "",
    prenom: order.livraison_prenom || "",
    adresse1: order.livraison_adresse1 || "",
    adresse2: order.livraison_adresse2 || "",
    ville: order.livraison_ville || "",
    code_postale: order.livraison_code_postale || "",
    pays: order.livraison_pays || "",
    phone: order.livraison_phone || "",
  };
  const dateCommande = order.created_at
    ? new Date(order.created_at).toLocaleDateString("fr-FR")
    : "";
  const dateLivraison = order.date_livraison
    ? new Date(order.date_livraison).toLocaleDateString("fr-FR")
    : "";

  return (
    <main
      ref={printRef}
      className="document-print-area bg-white py-8 px-1 font-sans print:py-0 print:px-0"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 relative border border-blue-200 print:shadow-none print:border-none print:rounded-none print:p-0">
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
              BON DE LIVRAISON
            </span>
            <span className="text-[11px] text-gray-500 mt-2">
              Date de la commande : {dateCommande}
            </span>
            <span className="text-[11px] text-gray-500">
              Date de livraison : {dateLivraison}
            </span>
            <span className="text-[11px] text-gray-500">
              N° : <span className="font-semibold">{order.numero_bl || order.numero}</span>
            </span>
          </div>
        </div>
        {/* Orange thin line */}
        <div className="w-full h-0.5 mb-4" style={{ background: ORANGE, borderRadius: 2 }} />
        {/* Client & Delivery */}
        <div className="flex flex-row justify-between gap-4 mb-4">
          {/* Client */}
          <div className="flex-1">
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
          {/* Delivery */}
          <div className="flex-1">
            <div className="font-semibold text-[13px] text-blue-700 mb-1">Adresse de livraison</div>
            <div className="text-[11px] text-gray-700 leading-tight">
              <div>{delivery.prenom} {delivery.nom}</div>
              <div>{delivery.adresse1}</div>
              {delivery.adresse2 && <div>{delivery.adresse2}</div>}
              <div>{delivery.ville}{delivery.code_postale ? `, ${delivery.code_postale}` : ""}</div>
              <div>{delivery.pays}</div>
              <div>Tél : {delivery.phone || "N/A"}</div>
            </div>
          </div>
        </div>
        {/* Table: Products */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border rounded-lg overflow-hidden shadow-sm text-[12px]">
            <thead>
              <tr className="bg-[#FF4301] text-white">
                <th className="p-1 text-left font-semibold">Produit</th>
                <th className="p-1 text-right font-semibold">Quantité</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <tr key={idx} className="border-t hover:bg-orange-50">
                    <td className="p-1">{item.title || item.name || item.product_name || "Produit"}</td>
                    <td className="p-1 text-right">{item.quantity ?? item.qty ?? 1}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center text-gray-400 py-2">
                    Aucun produit trouvé dans cette commande.<br />
                    <span className="text-xs text-red-400">Vérifiez la structure de la commande dans la console.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex flex-col items-center">
            <QRCode value={`https://votresite.com/commande/${order.numero_bl || order.numero}`} size={48} logoImage={COMPANY.logo} />
            <span className="text-[11px] text-gray-500 mt-1">Scan pour vérifier</span>
          </div>
        </div>
        {/* Footer with RIB and copyright */}
        <div className="flex flex-row justify-between items-end mt-6 border-t pt-3 text-[10px]">
          {/* RIB bank info bottom left */}
          <div className="bg-white border border-orange-400 rounded-lg px-3 py-2 shadow text-[12px] text-gray-800 font-semibold flex items-center gap-2">
            <span className="text-orange-600 font-bold">Bank BAN RIB:</span>
            <span>03507065011500468753</span>
          </div>
          {/* Copyright right */}
          <div className="text-gray-400 text-right flex-1 ml-4">
            &copy; {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
          </div>
        </div>
      </div>
    </main>
  );
};

export default BonLivraisonDocument;
