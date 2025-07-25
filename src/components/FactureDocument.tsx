import { QRCode } from "react-qrcode-logo";
import n2words from "n2words";
import Image from "next/image";

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "sobitas",
  nif: "1234567A",
  rc: "B123456789",
  email: "contact@protein.tn",  
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+216 73 200 169"
};

const ORANGE = "#FF4301";

function numberToFrenchWords(n: number): string {
  return n2words(n, { lang: "fr" });
}

const FactureDocument = (props) => {
  const { order, printRef } = props || {};
  if (!order) return null;
  const cart =
    Array.isArray(order.cart) && order.cart.length > 0
      ? order.cart
      : Array.isArray(order.products) && order.products.length > 0
      ? order.products
      : Array.isArray(order.items) && order.items.length > 0
      ? order.items
      : [];
  const totalTTC = Number(order.prix_ttc || 0);
const totalTimbre = order.timbre !== undefined ? Number(order.timbre) : 0.6;
const baseTTC = totalTTC - totalTimbre;
const totalHT = baseTTC / 1.19;
const totalTVA = baseTTC - totalHT;


  const totalTTCInt = Math.floor(totalTTC);
  const totalTTCDec = Math.round((totalTTC - totalTTCInt) * 100);

  const totalTTCWords =
    numberToFrenchWords(totalTTCInt).charAt(0).toUpperCase() +
    numberToFrenchWords(totalTTCInt).slice(1) +
    (totalTTCDec > 0
      ? " dinars et " +
        numberToFrenchWords(totalTTCDec) +
        " millimes"
      : " dinars");

  const qrValue = `https://votresite.com/commande/${order.numero}`;

  const client = {
    nom: order.nom,
    prenom: order.prenom,
    adresse1: order.adresse1,
    adresse2: order.adresse2,
    ville: order.ville,
    code_postale: order.code_postale,
    pays: order.pays,
    nif: order.client_nif,
    email: order.email,
    phone: order.phone,
  };

  const dateEmission = order.created_at
    ? new Date(order.created_at).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  return (
    <main
      ref={printRef}
      className="document-print-area bg-white py-8 px-1 font-sans print:py-0 print:px-0"
    >
      <div className="facture-modal w-full max-w-xs sm:max-w-md md:max-w-2xl mx-auto bg-white rounded-lg sm:rounded-2xl shadow-2xl p-1 sm:p-4 md:p-6 relative border border-blue-200 print:shadow-none print:border-none print:rounded-none print:p-0" style={{ minWidth: 0 }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col items-start">
            <Image src={COMPANY.logo} alt="Logo" width={48} height={48} className="h-12 mb-1" loading="lazy" />
            <div className="text-[11px] text-gray-700 leading-tight">
              <div className="mb-0.5 font-bold">{COMPANY.name}</div>
              <div className="mb-0.5">{COMPANY.address}</div>
              <div>NIF : {COMPANY.nif} | RC : {COMPANY.rc}</div>
              <div>{COMPANY.email}</div>
              <div>{COMPANY.tel}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-extrabold text-right" style={{ color: ORANGE, letterSpacing: "1px" }}>
              FACTURE
            </span>
            <span className="text-[11px] text-gray-700 mt-2">
              Date démission : {dateEmission}
            </span>
            <span className="text-[11px] text-gray-700">
              N° : <span className="font-semibold">{order.numero}</span>
            </span>
          </div>
        </div>
        {/* Orange thin line */}
        <div className="w-full h-0.5 mb-4" style={{ background: ORANGE, borderRadius: 2 }} />
        {/* Client */}
        <div className="flex flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-[13px] text-blue-700 mb-1">Facturé à</div>
            <div className="text-[11px] text-gray-700 leading-tight">
              <div>{client.prenom} {client.nom}</div>
              <div>{client.adresse1}</div>
              {client.adresse2 && <div>{client.adresse2}</div>}
              <div>{client.ville}{client.code_postale ? `, ${client.code_postale}` : ""}</div>
              <div>{client.pays}</div>
              {client.nif && <div>NIF : {client.nif}</div>}
              <div>Email : {client.email}</div>
              <div>Tél : {client.phone}</div>
            </div>
          </div>
        </div>
        {/* Table: Products */}
        <div className="facture-table-container overflow-x-auto mb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="facture-table w-full min-w-[320px] border rounded-lg overflow-hidden shadow-sm text-[12px]">
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
                  <td colSpan={5} className="text-center text-gray-700 py-2">
                    Aucun produit trouvé dans cette commande.<br />
                    <span className="text-xs text-red-600">Vérifiez la structure de la commande dans la console.</span>
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
            <span className="font-medium">TVA (19%) :</span>
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
              Arrêté la présente facture à la somme de :
            </span>
            <span className="italic text-orange-700 font-semibold text-[12px]">
              {totalTTCWords}
            </span>
          </div>
        </div>
        {/* QR code only (signature removed) */}
        <div className="flex justify-end items-end mb-6">
          <div className="flex flex-col items-center">
            <QRCode value={qrValue} size={48} logoImage={COMPANY.logo} />
            <span className="text-[11px] text-gray-700 mt-1">Scan pour vérifier</span>
          </div>
        </div>
        {/* Legal mentions */}
        <div className="text-[10px] text-gray-700 mt-2">
          <div>
            Conditions de paiement : {order.conditions_paiement || "30 jours, virement bancaire"}
          </div>
          <div>
            Pénalités de retard : {order.penalites_retard || "En cas de non-paiement à léchéance, des pénalités seront appliquées conformément à la législation en vigueur."}
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
          <div className="text-gray-700 text-right flex-1 ml-4">
            &copy; {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
          </div>
        </div>
      </div>
    </main>
  );
};

export default FactureDocument;
