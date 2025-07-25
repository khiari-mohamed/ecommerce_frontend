import React, { forwardRef } from "react";
import Image from "next/image";
import n2words from "n2words";
import "../styles/print.css";

const COMPANY = {
  logo: "/images/logo/logo.png",
  email: "contact@protein.tn",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+216 73 200 169"
};
const ORANGE = "#FF4301";

function numberToFrenchWords(n: number): string {
  return n2words(n, { lang: "fr" });
}

function getProductArray(order: any): any[] {
  if (!order) return [];
  if (Array.isArray(order.cart) && order.cart.length > 0) return order.cart;
  if (Array.isArray(order.products) && order.products.length > 0) return order.products;
  if (Array.isArray(order.items) && order.items.length > 0) return order.items;
  if (order.cart && typeof order.cart === "object" && !Array.isArray(order.cart)) return [order.cart];
  if (order.products && typeof order.products === "object" && !Array.isArray(order.products)) return [order.products];
  if (order.items && typeof order.items === "object" && !Array.isArray(order.items)) return [order.items];
  return [];
}

const BonDeCommandeDocument = forwardRef(({ order, printRef }: { order: any, printRef?: any }, ref) => {
  const cart = getProductArray(order);
  const totalHT = Number(order.prix_ht || 0);
  const totalTVA = Number(order.tva || totalHT * 0.19);
  const totalTimbre = Number(order.timbre || 1);
  const totalTTC = Number(order.prix_ttc || 0);
  const totalTTCInt = Math.floor(totalTTC);
  const totalTTCDec = Math.round((totalTTC - totalTTCInt) * 100);
  const totalTTCWords =
    numberToFrenchWords(totalTTCInt).charAt(0).toUpperCase() +
    numberToFrenchWords(totalTTCInt).slice(1) +
    (totalTTCDec > 0
      ? " TND et " +
        numberToFrenchWords(totalTTCDec) +
        " millimes"
      : " TND");
  const billing = {
    nom: order.nom,
    prenom: order.prenom,
    adresse1: order.adresse1,
    pays: order.pays,
    email: order.email,
    phone: order.phone,
  };
  const shipping = {
    nom: order.livraison_nom,
    prenom: order.livraison_prenom,
    adresse1: order.livraison_adresse1,
    adresse2: order.livraison_adresse2,
    ville: order.livraison_ville,
    code_postale: order.livraison_code_postale,
    pays: order.livraison_pays,
    phone: order.livraison_phone,
  };
  return (
    <main
      ref={printRef || ref}
      className="document-print-area min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-8 px-1 font-sans print:bg-white print:py-0 print:px-0"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 relative border border-blue-200 print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col items-start">
            <Image src={COMPANY.logo} alt="Logo de la société" width={48} height={48} className="h-12 mb-1" priority={false} />
            <div className="text-[11px] text-gray-700 leading-tight">
              <div className="mb-0.5">{COMPANY.email}</div>
              <div className="mb-0.5">{COMPANY.address}</div>
              <div>{COMPANY.tel}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-extrabold text-right" style={{ color: ORANGE, letterSpacing: "1px" }}>Bon de Commande</span>
            <span className="text-[11px] text-gray-500 mt-2">
              Date : {new Date(order.created_at).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
            <span className="text-[11px] text-gray-500">N° : <span className="font-semibold">{order.numero}</span></span>
          </div>
        </div>
        {/* Orange thin line */}
        <div className="w-full h-0.5 mb-4" style={{ background: ORANGE, borderRadius: 2 }} />
        {/* User credentials */}
        <div className="flex flex-row justify-between gap-4 mb-4">
          {/* Billing */}
          <div className="flex-1">
            <div className="font-semibold text-[13px] text-blue-700 mb-1">Client</div>
            <div className="text-[11px] text-gray-700 leading-tight">
              <div>{billing.prenom} {billing.nom}</div>
              <div>{billing.adresse1}</div>
              <div>{billing.pays}</div>
              <div>Email : {billing.email}</div>
              <div>Tél : {billing.phone}</div>
            </div>
          </div>
          {/* Shipping */}
          <div className="flex-1">
            <div className="font-semibold text-[13px] text-blue-700 mb-1">Livraison</div>
            <div className="text-[11px] text-gray-700 leading-tight">
              <div>{shipping.prenom} {shipping.nom}</div>
              <div>{shipping.adresse1}</div>
              {shipping.adresse2 && <div>{shipping.adresse2}</div>}
              <div>{shipping.ville}{shipping.code_postale ? `, ${shipping.code_postale}` : ""}</div>
              <div>{shipping.pays}</div>
              <div>Tél : {shipping.phone || "N/A"}</div>
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
                <th className="p-1 text-right font-semibold">PU HT</th>
                <th className="p-1 text-right font-semibold">TVA</th>
                <th className="p-1 text-right font-semibold">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <tr key={idx} className="border-t hover:bg-orange-50">
                    <td className="p-1">{item.title || item.name || item.product_name || "Produit"}</td>
                    <td className="p-1 text-right">{item.quantity ?? item.qty ?? 1}</td>
                    <td className="p-1 text-right">
                      {Number(item.price ?? item.unit_price ?? 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                    </td>
                    <td className="p-1 text-right">
                      {item.tva
                        ? Number(item.tva).toLocaleString("fr-TN", { style: "currency", currency: "TND" })
                        : "0,000 TND"}
                    </td>
                    <td className="p-1 text-right">
                      {Number(
                        (item.price ?? item.unit_price ?? 0) * (item.quantity ?? item.qty ?? 1)
                      ).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-2">
                    Aucun produit trouvé dans cette commande.<br />
                    <span className="text-xs text-red-400">Vérifiez la structure de la commande dans la console.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Totals: right side */}
        <div className="flex flex-col items-end space-y-1 mb-6 text-[12px]">
          <div className="flex justify-between w-56">
            <span className="font-medium">Total HT :</span>
            <span>{totalHT.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
          </div>
          <div className="flex justify-between w-56">
            <span className="font-medium">TVA :</span>
            <span>{totalTVA.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
          </div>
          <div className="flex justify-between w-56">
            <span className="font-medium">TIMBRE :</span>
            <span>{totalTimbre.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
          </div>
          <div className="flex justify-between w-56 pt-2" style={{ borderTop: `2px solid ${ORANGE}` }}>
            <span className="font-bold">Total TTC :</span>
            <span className="font-bold">
              {totalTTC.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
            </span>
          </div>
        </div>
        {/* Amount in letters: left side with orange vertical bar */}
        <div className="mb-4 flex flex-row items-start ml-2">
          {/* Orange vertical bar */}
          <div
            className="mr-2"
            style={{
              width: "6px",
              minWidth: "6px",
              height: "40px",
              background: ORANGE,
              borderRadius: "4px"
            }}
          />
          <div className="flex flex-col items-start">
            <span className="text-[12px] font-medium">
              Arrêté le présent bon de commande à la somme de :
            </span>
            <span className="italic text-orange-700 font-semibold text-[12px]">
              {totalTTCWords}
            </span>
          </div>
        </div>
        {/* Thank you & rest of logic */}
        <div className="my-6 text-center">
          <div className="text-base font-bold text-green-600 mb-1">Merci pour votre commande !</div>
          <div className="text-sm text-gray-700 mb-1">Votre bon de commande a été généré avec succès.</div>
          <div className="text-xs text-blue-700">Nous vous remercions pour votre confiance.</div>
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
            &copy; {new Date().getFullYear()} Votre Société. Tous droits réservés.
          </div>
        </div>
      </div>
    </main>
  );
});

BonDeCommandeDocument.displayName = "BonDeCommandeDocument";
export default BonDeCommandeDocument;