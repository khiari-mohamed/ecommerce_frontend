import React from "react";
import { QRCode } from "react-qrcode-logo";
import n2words from "n2words";

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "sobitas",
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

const FBPrintable = ({ order }) => {
  if (!order) return null;
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
  const shipping = {
 nom: order.livraison_nom || "",
  prenom: order.livraison_prenom || "",
  adresse1: order.livraison_adresse1 || "",
  adresse2: order.livraison_adresse2 || "",
  ville: order.livraison_ville || "",
  code_postale: order.livraison_code_postale || "",
  pays: order.livraison_pays || "",
  phone: order.livraison_phone || "",
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
    <div
      className="facture-print"
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "32px 40px 40px 40px",
        background: "#fff",
        minHeight: "297mm",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        {/* Logo and company info */}
        <div>
          <img src={COMPANY.logo} alt="Logo" style={{ height: 36, marginBottom: 8 }} />
          <div style={{ fontSize: 13, color: "#222", lineHeight: 1.5 }}>
            <div style={{ fontWeight: 700 }}>{COMPANY.name}</div>
            <div>{COMPANY.email}</div>
            <div>{COMPANY.address}</div>
            <div>{COMPANY.tel}</div>
          </div>
        </div>
        {/* Facture type and meta */}
        <div style={{ textAlign: "right", minWidth: 160 }}>
          <div style={{
            color: ORANGE,
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1,
            marginBottom: 8
          }}>
            Facture Boutique
          </div>
          <div style={{ fontSize: 13, color: "#222" }}>
            <div style={{ marginBottom: 2 }}>
              <span style={{ color: "#888" }}>Date démission :</span> {dateEmission}
            </div>
            <div style={{ marginBottom: 2 }}>
              <span style={{ color: "#888" }}>N° :</span> <span style={{ fontWeight: 700 }}>{order.numero}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing and Shipping */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: "#222", lineHeight: 1.5, maxWidth: 320 }}>
          <div style={{ fontWeight: 700, color: "#2563eb", marginBottom: 2 }}>Facturé à</div>
          <div>{billing.prenom} {billing.nom}</div>
          <div>{billing.adresse1}</div>
          <div>{billing.pays}</div>
          <div>Email : {billing.email}</div>
          <div>Tél : {billing.phone}</div>
        </div>
        <div style={{ fontSize: 13, color: "#222", lineHeight: 1.5, maxWidth: 320 }}>
          <div style={{ fontWeight: 700, color: "#2563eb", marginBottom: 2 }}>Livraison</div>
          <div>{shipping.prenom} {shipping.nom}</div>
          <div>{shipping.adresse1}</div>
          {shipping.adresse2 && <div>{shipping.adresse2}</div>}
          <div>{shipping.ville}{shipping.code_postale ? `, ${shipping.code_postale}` : ""}</div>
          <div>{shipping.pays}</div>
          <div>Tél : {shipping.phone || "N/A"}</div>
        </div>
      </div>

      {/* Table: Products */}
      <table className="facture-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18, fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ background: ORANGE, color: "#fff", fontWeight: 700, padding: "8px 6px", border: "none" }}>Produit</th>
            <th style={{ background: ORANGE, color: "#fff", fontWeight: 700, padding: "8px 6px", border: "none" }}>Quantité</th>
            <th style={{ background: ORANGE, color: "#fff", fontWeight: 700, padding: "8px 6px", border: "none" }}>PU HT</th>
            <th style={{ background: ORANGE, color: "#fff", fontWeight: 700, padding: "8px 6px", border: "none" }}>TVA</th>
            <th style={{ background: ORANGE, color: "#fff", fontWeight: 700, padding: "8px 6px", border: "none" }}>Total HT</th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <tr key={idx}>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "8px 6px" }}>{item.title || item.name || item.product_name || "Produit"}</td>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "8px 6px", textAlign: "right" }}>{item.quantity ?? item.qty ?? 1}</td>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "8px 6px", textAlign: "right" }}>
                  {Number(item.price ?? item.unit_price ?? 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                </td>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "8px 6px", textAlign: "right" }}>
                  {item.tva
                    ? Number(item.tva).toLocaleString("fr-TN", { style: "currency", currency: "TND" })
                    : "0,000 TND"}
                </td>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "8px 6px", textAlign: "right" }}>
                  {Number(
                    (item.price ?? item.unit_price ?? 0) * (item.quantity ?? item.qty ?? 1)
                  ).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", color: "#aaa", padding: "12px 0" }}>
                Aucun produit trouvé dans cette commande.<br />
                <span style={{ fontSize: 11, color: "#f87171" }}>Vérifiez la structure de la commande dans la console.</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals: right side */}
      <div style={{ float: "right", width: 320, marginTop: 8, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 2 }}>
          <span>Total HT :</span>
          <span>{totalHT.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 2 }}>
          <span>TVA :</span>
          <span>{totalTVA.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 2 }}>
          <span>TIMBRE :</span>
          <span>{totalTimbre.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
        </div>
        <div style={{ borderTop: `2px solid ${ORANGE}`, margin: "8px 0" }}></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: ORANGE, fontSize: 15 }}>
          <span>Total TTC :</span>
          <span>{totalTTC.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</span>
        </div>
      </div>
      <div style={{ clear: "both" }}></div>

      {/* Amount in words */}
      <div className="facture-amount-words" style={{ marginTop: 24, fontStyle: "italic", fontWeight: 600, fontSize: 13 }}>
        Arrêté la présente facture à la somme de : <span style={{ color: ORANGE }}>{totalTTCWords}</span>
      </div>

      {/* QR code */}
      <div className="facture-qr" style={{ float: "right", marginTop: 24, textAlign: "right" }}>
        <QRCode value={order.numero ? `https://votresite.com/commande/${order.numero}` : ""} size={80} logoImage={COMPANY.logo} />
        <div className="facture-qr-caption" style={{ fontSize: 12, color: "#222", marginTop: 4 }}>Scan pour vérifier</div>
      </div>
      <div style={{ clear: "both" }}></div>

      {/* Footer */}
      <div className="facture-footer" style={{ textAlign: "center", marginTop: 48, fontSize: 13, color: "#222" }}>
        <div className="thanks" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#222" }}>
          Merci pour votre confiance !
        </div>
        <div>
          &copy; {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
        </div>
      </div>
    </div>
  );
};

export default FBPrintable;