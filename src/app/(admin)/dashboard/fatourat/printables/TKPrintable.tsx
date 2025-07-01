import React from "react";
import { QRCode } from "react-qrcode-logo";

const COMPANY = {
  logo: "/images/logo/logo.png",
  name: "SOBITAS",
  address: "Rue Ribat, 4000 Sousse Tunisie",
  tel: "+21627612500 / +21673200169",
  website: "WWW.PROTEIN.TN",
};

const ORANGE = "#FF4301";

const TKPrintable = ({ order }) => {
  if (!order) return null;
  const items = Array.isArray(order.items) ? order.items : [];
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString("fr-FR")
    : "";
  const time = order.created_at
    ? new Date(order.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "";

  const total = Number(order.prix_ttc || order.total || 0);
  const remise = Number(order.remise || 0);
  const totalHT = Number(order.prix_ht || 0);

  return (
    <div
      className="ticket-paper-outer"
      style={{
        width: "90mm",
        minWidth: "90mm",
        maxWidth: "90mm",
        background: "#f5f5f5",
        padding: 0,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <div
        className="ticket-root"
        style={{
          width: "80mm",
          minWidth: "80mm",
          maxWidth: "80mm",
          margin: "10mm auto",
          padding: 10,
          border: "1px dashed #bbb",
          fontFamily: "'Inter', 'Courier New', Courier, monospace",
          background: "#fff",
          color: "#000",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          lineHeight: 1.2,
          boxShadow: "0 0 0.5mm #ccc"
        }}
      >
        {/* Logo */}
        <div className="ticket-logo" style={{ width: "100%", textAlign: "center", marginBottom: 10 }}>
          <img
            src={COMPANY.logo}
            alt="Logo"
            className="ticket-logo-img"
            style={{
              display: "block",
              margin: "0 auto",
              maxHeight: 32,
              maxWidth: "60mm",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              background: "transparent"
            }}
          />
        </div>
        {/* Header Info */}
        <div className="ticket-header-info" style={{ textAlign: "center", marginBottom: 8 }}>
          <div className="ticket-welcome" style={{ fontWeight: "bold", fontSize: 13, textTransform: "uppercase", marginBottom: 5 }}>
            BIENVENUE CHEZ {COMPANY.name}
          </div>
          <div className="ticket-address" style={{ fontSize: 11, margin: "3px 0" }}>Adresse: {COMPANY.address}</div>
          <div className="ticket-tel" style={{ fontSize: 11, margin: "3px 0" }}>Tel: {COMPANY.tel}</div>
        </div>
        <div className="ticket-separator" style={{ width: "100%", textAlign: "center", margin: "8px 0", borderBottom: "1px dashed #bbb" }}>-----------------------</div>
        {/* Date & Time */}
        <div className="ticket-meta" style={{ width: "100%", textAlign: "center", fontSize: 11, marginBottom: 8, display: "flex", justifyContent: "center" }}>
          <span>{date}</span>
          <span style={{ marginLeft: 8 }}>{time}</span>
        </div>
        {/* Items Table */}
        <table style={{ width: "100%", fontSize: 11, marginBottom: 8, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", fontWeight: "bold", borderBottom: "1px solid #ccc", padding: "2px 0" }}>Produit</th>
              <th style={{ textAlign: "center", fontWeight: "bold", borderBottom: "1px solid #ccc", padding: "2px 0" }}>QTE</th>
              <th style={{ textAlign: "right", fontWeight: "bold", borderBottom: "1px solid #ccc", padding: "2px 0" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "left", padding: "2px 0", borderBottom: "1px dashed #eee" }}>{item.name}</td>
                  <td style={{ textAlign: "center", padding: "2px 0", borderBottom: "1px dashed #eee" }}>{item.qty ?? item.quantity ?? 1}</td>
                  <td style={{ textAlign: "right", padding: "2px 0", borderBottom: "1px dashed #eee" }}>{Number(item.price).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "#aaa", padding: "8px 0" }}>
                  Aucun article
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Totals */}
        <div className="ticket-totals" style={{ width: "100%", margin: "8px 0", fontSize: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "3px 0" }}>
            <span>Total</span>
            <span>{total.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "3px 0" }}>
            <span>Remise</span>
            <span>{remise.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "3px 0" }}>
            <span>Total HT</span>
            <span>{totalHT.toFixed(2)}</span>
          </div>
        </div>
        <div className="ticket-separator" style={{ width: "100%", textAlign: "center", margin: "8px 0", borderBottom: "1px dashed #bbb" }}>--------------</div>
        <div className="ticket-footer" style={{ width: "100%", textAlign: "center", fontSize: 11, margin: "8px 0", fontWeight: "bold" }}>
          {COMPANY.name} vous remercie de votre visite
        </div>
        <div className="ticket-separator" style={{ width: "100%", textAlign: "center", margin: "8px 0", borderBottom: "1px dashed #bbb" }}>---------------</div>
        <div className="ticket-website" style={{ width: "100%", textAlign: "center", fontSize: 11, fontWeight: "bold", marginTop: 5 }}>
          <div style={{ textTransform: "uppercase", marginBottom: 3 }}>NOTRE SITE WEB</div>
          <div>{COMPANY.website}</div>
        </div>
        {/* QR code at the bottom */}
        <div style={{ marginTop: 10, marginBottom: 0, width: "100%", textAlign: "center" }}>
          <QRCode value={order.numero ? `https://votresite.com/commande/${order.numero}` : ""} size={40} logoImage={COMPANY.logo} />
          <div style={{ fontSize: 10, color: "#222", marginTop: 2 }}>Scan pour vérifier</div>
        </div>
      </div>
    </div>
  );
};

export default TKPrintable;