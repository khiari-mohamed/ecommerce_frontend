"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";
import { QRCode } from "react-qrcode-logo";
import n2words from "n2words";
import BonLivraisonDocument from "@/components/BonLivraisonDocument";
import DevisDocument from "@/components/DevisDocument";
import FactureDocument from "@/components/FactureDocument";
import Image from "next/image";

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

const OrderInvoice = ({ order, printRef }) => {
  const cart = getProductArray(order);
  const totalHT = Number(order.prix_ht || 0);
  const totalTVA = totalHT * 0.19;
  const totalTimbre = 1;
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
  const qrValue = `https://votresite.com/commande/${order.numero}`;
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
      ref={printRef}
      className="document-print-area min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-4 px-1 sm:py-8 sm:px-2 md:px-4 font-sans print:bg-white print:py-0 print:px-0"
    >
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-2 sm:p-4 md:p-6 relative border border-blue-200 print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2 sm:gap-0">
          <div className="flex flex-col items-start">
            <Image src={COMPANY.logo} alt="Logo Votre Société" width={96} height={96} className="h-16 w-24 sm:h-20 sm:w-32 object-contain mb-1" loading="lazy" sizes="96px" />
            <div className="text-[11px] text-gray-700 leading-tight">
              <div className="mb-0.5">{COMPANY.email}</div>
              <div className="mb-0.5">{COMPANY.address}</div>
              <div>{COMPANY.tel}</div>
            </div>
          </div>
          <div className="flex flex-col items-end mt-2 sm:mt-0">
            <span className="text-xl sm:text-2xl font-extrabold text-right" style={{ color: ORANGE, letterSpacing: "1px" }}>Facture</span>
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
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          {/* Billing */}
          <div className="flex-1 mb-2 sm:mb-0">
            <div className="font-semibold text-[13px] text-blue-700 mb-1">Facturé à</div>
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
          <table className="w-full border rounded-lg overflow-hidden shadow-sm text-[11px] sm:text-[12px]">
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
                    <td className="p-1 max-w-[120px] sm:max-w-none truncate">{item.title || item.name || item.product_name || "Produit"}</td>
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
        <div className="flex flex-col items-end space-y-1 mb-6 text-[12px] w-full">
          <div className="flex justify-between w-full sm:w-72 md:w-56">
            <span className="font-medium">Total HT :</span>
            <span>{totalHT.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
          </div>
          <div className="flex justify-between w-full sm:w-72 md:w-56">
            <span className="font-medium">TVA (19%) :</span>
            <span>{totalTVA.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
          </div>
          <div className="flex justify-between w-full sm:w-72 md:w-56">
            <span className="font-medium">TIMBRE :</span>
            <span>{totalTimbre.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
          </div>
          <div className="flex justify-between w-full sm:w-72 md:w-56 pt-2" style={{ borderTop: `2px solid ${ORANGE}` }}>
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
            className="mr-2 hidden sm:block"
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
            <span className="text-[11px] text-gray-500 mt-1">Scan pour vérifier</span>
          </div>
        </div>
        {/* Thank you & rest of logic */}
        <div className="my-6 text-center">
          <div className="text-base font-bold text-green-600 mb-1">Merci pour votre confiance !</div>
          <div className="text-sm text-gray-700 mb-1">Votre commande a été enregistrée avec succès.</div>
          <div className="text-xs text-blue-700">Nous vous remercions pour votre achat et espérons vous revoir bientôt.</div>
        </div>
        {/* Footer with RIB and copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-end mt-6 border-t pt-3 text-[10px] gap-2 sm:gap-0">
          {/* RIB bank info bottom left */}
          <div className="bg-white border border-orange-400 rounded-lg px-3 py-2 shadow text-[12px] text-gray-800 font-semibold flex items-center gap-2 mb-2 sm:mb-0">
            <span className="text-orange-600 font-bold">Bank BAN RIB:</span>
            <span>03507065011500468753</span>
          </div>
          {/* Copyright right */}
          <div className="text-gray-400 text-right flex-1 ml-0 sm:ml-4">
            &copy; {new Date().getFullYear()} Votre Société. Tous droits réservés.
          </div>
        </div>
      </div>
    </main>
  );
};

const FloatingActions = ({ onHome, setPreviewDoc }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        aria-label="Ouvrir les actions"
        className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl transition-all print:hidden"
        onClick={() => setOpen((v) => !v)}
        style={{ background: ORANGE }}
      >
        <span style={{ fontWeight: 700 }}>⋮</span>
      </button>
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-4 flex flex-col gap-3 animate-fade-in print:hidden"
          style={{ minWidth: 220 }}
        >
          <button
            onClick={() => { setOpen(false); setPreviewDoc("bon-livraison"); }}
            className="w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-orange-50 text-blue-700 border border-blue-200"
          >
            Voir Bon de Livraison
          </button>
          <button
            onClick={() => { setOpen(false); setPreviewDoc("devis"); }}
            className="w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-orange-50 text-green-700 border border-green-200"
          >
            Voir Devis
          </button>
          <button
            onClick={() => { setOpen(false); setPreviewDoc(null); setTimeout(() => window.print(), 100); }}
            className="w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-orange-50 text-orange-700 border border-orange-200"
          >
            Télécharger la facture (PDF)
          </button>
          <button
            onClick={() => { setOpen(false); setPreviewDoc("bon-livraison"); setTimeout(() => window.print(), 100); }}
            className="w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-orange-50 text-blue-700 border border-blue-200"
          >
            Télécharger le bon de livraison (PDF)
          </button>
          <button
            onClick={() => { setOpen(false); setPreviewDoc("devis"); setTimeout(() => window.print(), 100); }}
            className="w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-orange-50 text-green-700 border border-green-200"
          >
            Télécharger le devis (PDF)
          </button>
          <button
            onClick={() => { setOpen(false); onHome(); }}
            className="w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-gray-100 text-gray-700 border border-gray-200"
          >
            Retour à laccueil
          </button>
          <button
            onClick={() => { setOpen(false); setPreviewDoc("facture-boutique"); setTimeout(() => window.print(), 100); }}
            className="w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-orange-50 text-purple-700 border border-purple-200"
          >
            Télécharger la facture de boutique (PDF)
          </button>
          <button
            onClick={() => { setOpen(false); setPreviewDoc("facture-boutique"); }}
            className="w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-orange-50 text-purple-700 border border-purple-200"
          >
            Voir Facture de Boutique
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-gray-100 text-gray-400 border border-gray-100"
          >
            Fermer
          </button>
        </div>
      )}
    </>
  );
};

const OrderConfirmationClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState(null);
  const printRef = useRef(null);
  const [previewDoc, setPreviewDoc] = useState<null | "bon-livraison" | "devis" | "facture-boutique">(null);
  const [popupKey, setPopupKey] = useState(0);

  useEffect(() => {
    if (orderNumber) {
      axios.get(`/commande/numero/${orderNumber}`)
        .then(res => {
          setOrder(res.data);
          if (typeof window !== "undefined") {
            console.log("Order loaded:", res.data);
          }
        })
        .catch(() => setOrder(null));
    }
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleHome = () => {
    router.push("/");
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-2 text-center">
        <Image src={COMPANY.logo} alt="Logo Votre Société" width={96} height={96} className="h-16 w-24 sm:h-20 sm:w-32 object-contain mb-4" loading="lazy" sizes="96px" />
        <div className="text-lg text-blue-700 font-bold mb-2">Chargement de votre commande...</div>
        <div className="text-gray-500 text-sm">Veuillez patienter.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex justify-center items-start py-4 sm:py-10 px-1 sm:px-2 md:px-4">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Main content */}
        <div className="flex-1 flex justify-center">
          {previewDoc === "bon-livraison" ? (
            <BonLivraisonDocument order={order} printRef={printRef} />
          ) : previewDoc === "devis" ? (
            <DevisDocument order={order} printRef={printRef} />
          ) : previewDoc === "facture-boutique" ? (
            <FactureDocument order={order} printRef={printRef} />
          ) : (
            <OrderInvoice order={order} printRef={printRef} />
          )}
        </div>
      </div>
      {/* Floating actions */}
      <FloatingActions 
        key={popupKey} 
        onHome={handleHome} 
        setPreviewDoc={setPreviewDoc} 
      />
    </div>
  );
};

export default OrderConfirmationClient;
