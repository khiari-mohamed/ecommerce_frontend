import React from "react";
import { QRCode } from "react-qrcode-logo";

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "sobitas",
  email: "contact@protein.tn",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+216 73 200 169"
};

const ORANGE = "#FF4301";

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

const BDCPrintable = ({ order }) => {
  if (!order) return null;
  const cart = getProductArray(order);
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
        <div>
          <img src={COMPANY.logo} alt="Logo" style={{ height: 36, marginBottom: 8 }} />
          <div style={{ fontSize: 13, color: "#222", lineHeight: 1.5 }}>
            <div style={{ fontWeight: 700 }}>{COMPANY.name}</div>
            <div>{COMPANY.email}</div>
            <div>{COMPANY.address}</div>
            <div>{COMPANY.tel}</div>
          </div>
        </div>
        <div style={{ textAlign: "right", minWidth: 160 }}>
          <div style={{
            color: ORANGE,
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1,
            marginBottom: 8
          }}>
            BON DE COMMANDE
          </div>
          <div style={{ fontSize: 13, color: "#222" }}>
            <div style={{ marginBottom: 2 }}>
              <span style={{ color: "#888" }}>Date de la commande :</span> {dateCommande}
            </div>
            <div style={{ marginBottom: 2 }}>
              <span style={{ color: "#888" }}>Date de livraison :</span> {dateLivraison}
            </div>
            <div style={{ marginBottom: 2 }}>
              <span style={{ color: "#888" }}>N° :</span> <span style={{ fontWeight: 700 }}>{order.numero_bl || order.numero}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orange thin line */}
      <div style={{ width: "100%", height: 2, background: ORANGE, borderRadius: 2, marginBottom: 18 }} />

      {/* Client & Delivery */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: "#222", lineHeight: 1.5, maxWidth: 320 }}>
          <div style={{ fontWeight: 700, color: "#2563eb", marginBottom: 2 }}>Client</div>
          <div>{client.prenom} {client.nom}</div>
          <div>{client.adresse1}</div>
          {client.adresse2 && <div>{client.adresse2}</div>}
          <div>{client.ville}{client.code_postale ? `, ${client.code_postale}` : ""}</div>
          <div>{client.pays}</div>
          <div>Email : {client.email}</div>
          <div>Tél : {client.phone}</div>
        </div>
        <div style={{ fontSize: 13, color: "#222", lineHeight: 1.5, maxWidth: 320 }}>
          <div style={{ fontWeight: 700, color: "#2563eb", marginBottom: 2 }}>Adresse de livraison</div>
          <div>{delivery.prenom} {delivery.nom}</div>
          <div>{delivery.adresse1}</div>
          {delivery.adresse2 && <div>{delivery.adresse2}</div>}
          <div>{delivery.ville}{delivery.code_postale ? `, ${delivery.code_postale}` : ""}</div>
          <div>{delivery.pays}</div>
          <div>Tél : {delivery.phone || "N/A"}</div>
        </div>
      </div>

      {/* Table: Products */}
      <table className="facture-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18, fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ background: ORANGE, color: "#fff", fontWeight: 700, padding: "8px 6px", border: "none" }}>Produit</th>
            <th style={{ background: ORANGE, color: "#fff", fontWeight: 700, padding: "8px 6px", border: "none" }}>Quantité</th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <tr key={idx}>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "8px 6px" }}>{item.title || item.name || item.product_name || "Produit"}</td>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "8px 6px", textAlign: "right" }}>{item.quantity ?? item.qty ?? 1}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ textAlign: "center", color: "#aaa", padding: "12px 0" }}>
                Aucun produit trouvé dans cette commande.<br />
                <span style={{ fontSize: 11, color: "#f87171" }}>Vérifiez la structure de la commande dans la console.</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* QR code */}
      <div className="facture-qr" style={{ float: "right", marginTop: 24, textAlign: "right" }}>
        <QRCode value={order.numero_bl ? `https://votresite.com/commande/${order.numero_bl}` : ""} size={80} logoImage={COMPANY.logo} />
        <div className="facture-qr-caption" style={{ fontSize: 12, color: "#222", marginTop: 4 }}>Scan pour vérifier</div>
      </div>
      <div style={{ clear: "both" }}></div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 24, borderTop: "1px solid #e5e7eb", paddingTop: 12, fontSize: 11 }}>
        <div style={{ background: "#fff", border: `1px solid ${ORANGE}`, borderRadius: 8, padding: "8px 16px", fontWeight: 600, color: "#222", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: ORANGE, fontWeight: 700 }}>Bank BAN RIB:</span>
          <span>03507065011500468753</span>
        </div>
        <div style={{ color: "#aaa", textAlign: "right", flex: 1, marginLeft: 16 }}>
          &copy; {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
        </div>
      </div>
    </div>
  );
};

export default BDCPrintable;