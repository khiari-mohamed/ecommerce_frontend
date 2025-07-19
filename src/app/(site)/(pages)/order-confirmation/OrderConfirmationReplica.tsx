import React from "react";
import Image from "next/image";
import Header from "@/components/Header";

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' });
}

function getProductArray(order) {
  if (!order) return [];
  if (Array.isArray(order.cart) && order.cart.length > 0) return order.cart;
  if (Array.isArray(order.products) && order.products.length > 0) return order.products;
  if (Array.isArray(order.items) && order.items.length > 0) return order.items;
  if (order.cart && typeof order.cart === "object" && !Array.isArray(order.cart)) return [order.cart];
  if (order.products && typeof order.products === "object" && !Array.isArray(order.products)) return [order.products];
  if (order.items && typeof order.items === "object" && !Array.isArray(order.items)) return [order.items];
  return [];
}

const OrderConfirmationReplica = ({ order, onShowOriginal }) => {
  const cart = getProductArray(order);
  const total = Number(order?.prix_ttc || 0);
  const subtotal = Number(order?.prix_ht || 0);
  const shipping = Number(order?.frais_livraison || 0);
  const paymentMethod = order?.paymentMethod === "payme" ? "Carte Bancaire" : "Paiement à la livraison";
  const billing = order || {};
  const shippingAddress = order || {};

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden" style={{ fontFamily: "Inter, Arial, sans-serif", color: "#444" }}>
      <Header />
      <main className="woocommerce-page py-0 px-0">
        {/* Fidelity Banner */}
        <div className="w-full bg-[#3074fc] py-2 mt-2 md:mt-16">
          <div className="w-full max-w-full px-2 sm:px-4 flex flex-col items-center justify-center">
            <span className="gamma widget-title font-bold text-[16px] text-center mb-1" style={{ fontFamily: "Inter, Arial, sans-serif", color: "#000" }}>
              Une Exclusivité sobitas-protein tunise
            </span>
            <p className="text-[13px] text-white text-center font-normal mt-1 mb-0 whitespace-normal break-words" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
              Avec le programme <b>sobitas Fidelity</b>, cumule un max de points et transforme les en bons de réduction dès 1000 points !
            </p>
          </div>
        </div>
        {/* Green success notice */}
        <div className="flex flex-col items-center justify-center pt-8">
          <div className="flex flex-row items-center justify-center gap-2 mb-6">
            <svg width="24" height="24" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle md:w-[34px] md:h-[34px] w-[24px] h-[24px]">
              <circle cx="17" cy="17" r="15.5" stroke="#108c1c" strokeWidth="1.2" fill="none" />
              <path d="M11 18l5 5 8-10" stroke="#108c1c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span className="woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received text-center text-[18px] md:text-[26px] font-medium leading-[1.3]" style={{ fontFamily: "Inter, Arial, sans-serif", color: "#108c1c" }}>
              Merci. Votre commande a été reçue.
            </span>
          </div>
        </div>
        {/* Order Overview */}
        <div className="flex justify-center w-full">
          <ul
            className="flex flex-row flex-wrap gap-y-1 gap-x-2 justify-center border-0 px-4 md:px-8 py-6 mb-6 text-[15px] text-[#444] w-full"
            style={{
              fontFamily: "Inter, Arial, sans-serif",
              background: "#f7f7f7",
              width: "100%",
              maxWidth: "1200px",
              borderRadius: 0,
              boxShadow: "none",
              marginTop: 0,
            }}
          >
            <li className="min-w-[180px] flex flex-col items-center">
              <span className="block text-[#888] text-[15px] mb-1" style={{ fontWeight: 400 }}>Numéro de commande :</span>
              <strong className="text-[16px] font-semibold text-[#222]">{order?.numero || "-"}</strong>
            </li>
            <li className="min-w-[180px] flex flex-col items-center">
              <span className="block text-[#888] text-[15px] mb-1" style={{ fontWeight: 400 }}>Date :</span>
              <strong className="text-[16px] font-semibold text-[#222]">{formatDate(order?.created_at)}</strong>
            </li>
            <li className="min-w-[180px] flex flex-col items-center">
              <span className="block text-[#888] text-[15px] mb-1" style={{ fontWeight: 400 }}>Total :</span>
              <strong className="text-[16px] font-semibold text-[#222]">
                <span className="woocommerce-Price-amount amount">
                  <bdi>{total.toLocaleString("fr-TN", { style: "currency", currency: "TND" }).replace(",000", "")}</bdi>
                </span>
              </strong>
            </li>
            <li className="min-w-[180px] flex flex-col items-center">
              <span className="block text-[#888] text-[15px] mb-1" style={{ fontWeight: 400 }}>Moyen de paiement :</span>
              <strong className="text-[16px] font-semibold text-[#222]">{paymentMethod}</strong>
            </li>
          </ul>
        </div>
        {paymentMethod === "Paiement à la livraison" && (
          <div className="px-8 w-full flex justify-center mb-6">
            <div style={{ maxWidth: "1200px", width: "100%" }}>
              <p className="text-[15px] text-[#444]" style={{ fontFamily: "Inter, Arial, sans-serif", marginBottom: 0 }}>Payez en argent comptant à la livraison.</p>
            </div>
          </div>
        )}
        {paymentMethod === "Carte Bancaire" && (
          <p className="text-[15px] text-[#444] mb-6 text-center" style={{ fontFamily: "Inter, Arial, sans-serif" }}>Votre paiement a été reçu par carte bancaire.</p>
        )}
        {/* Order Details Section */}
        <section className="woocommerce-order-details mb-6 flex justify-center w-full">
          <div
            className="overflow-x-auto w-full"
            style={{
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: "12px",
              maxWidth: "1200px",
              width: "100%",
              boxShadow: "none",
              padding: "0",
            }}
          >
            <div className="px-4 md:px-8 py-6">
              <h2
                className="woocommerce-order-details__title"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: "2rem", // reduced font size
                  marginBottom: "16px",
                  color: "#111",
                  lineHeight: 1.1,
                }}
              >
                Détails de la commande
              </h2>
              <table
                className="woocommerce-table woocommerce-table--order-details shop_table order_details w-full text-[14px] mb-4"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  background: "transparent",
                  border: "none",
                  borderRadius: 0,
                  boxShadow: "none",
                  tableLayout: "fixed", // Ensures columns align
                  width: "100%",
                }}
              >
                <colgroup>
                  <col style={{ width: "70%" }} />
                  <col style={{ width: "30%" }} />
                </colgroup>
                <thead>
                  <tr
                    style={{
                      borderTop: "1px solid #f0f0f0",
                      borderBottom: "1px solid #f0f0f0"
                    }}
                  >
                    <th
                      className="woocommerce-table__product-name product-name p-0 text-left font-semibold"
                      style={{
                        color: "#111",
                        fontWeight: 700,
                        fontSize: "1rem",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        paddingLeft: "0",
                        paddingTop: "6px",
                        paddingBottom: "6px"
                      }}
                    >
                      Produit
                    </th>
                    <th
                      className="woocommerce-table__product-table product-total p-0 text-right font-semibold"
                      style={{
                        color: "#111",
                        fontWeight: 700,
                        fontSize: "1rem",
                        border: "none",
                        background: "transparent",
                        textAlign: "right",
                        paddingRight: "0",
                        paddingTop: "6px",
                        paddingBottom: "6px"
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => {
                    const hasDiscount = item.discountedPrice && item.discountedPrice < item.price;
                    const productUrl = item.slug ? `/product/${item.slug}` : null;
                    return (
                      <tr key={idx} className="woocommerce-table__line-item order_item border-0 align-middle">
                        <td
                          className="woocommerce-table__product-name product-name pt-0 pb-2 text-left align-middle"
                          style={{
                            fontWeight: 400,
                            fontSize: "0.97rem",
                            border: "none",
                            background: "transparent",
                            textAlign: "left",
                            verticalAlign: "middle",
                            paddingLeft: "0",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {productUrl ? (
                              <a
                                href={productUrl}
                                className="text-[#3074fc] hover:underline font-medium"
                                style={{ fontWeight: 600 }}
                              >
                                {item.title || item.name || item.product_name || "Produit"}
                              </a>
                            ) : (
                              <span className="font-medium" style={{ fontWeight: 600 }}>
                                {item.title || item.name || item.product_name || "Produit"}
                              </span>
                            )}
                            <span style={{ fontWeight: 400 }}>&times;&nbsp;{item.quantity ?? item.qty ?? 1}</span>
                          </div>
                        </td>
                        <td
                          className="woocommerce-table__product-total product-total pt-0 pb-2 text-right align-middle"
                          style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "0.97rem",
                            textAlign: "right",
                            verticalAlign: "middle",
                            paddingRight: "0",
                          }}
                        >
                          {hasDiscount ? (
                            <span>
                              <del aria-hidden="true" style={{ color: "#888", marginRight: 6 }}>
                                <span className="woocommerce-Price-amount amount">
                                  <bdi>
                                    {Number(item.price).toLocaleString("fr-TN", {
                                      style: "currency",
                                      currency: "TND",
                                    }).replace(",000", "")}
                                  </bdi>
                                </span>
                              </del>
                              <span className="woocommerce-Price-amount amount text-[#222] font-semibold">
                                <bdi>
                                  {Number(item.discountedPrice).toLocaleString("fr-TN", {
                                    style: "currency",
                                    currency: "TND",
                                  }).replace(",000", "")}
                                </bdi>
                              </span>
                            </span>
                          ) : (
                            <span className="woocommerce-Price-amount amount text-[#222] font-semibold">
                              <bdi>
                                {Number(item.price ?? item.unit_price ?? 0).toLocaleString("fr-TN", {
                                  style: "currency",
                                  currency: "TND",
                                }).replace(",000", "")}
                              </bdi>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      scope="row"
                      className="pt-4 pb-1 text-left"
                      style={{
                        fontWeight: 400,
                        fontSize: "0.97rem",
                        border: "none",
                        textAlign: "left",
                        paddingLeft: "0",
                      }}
                    >
                      Sous-total :
                    </th>
                    <td
                      className="pt-4 pb-1 text-right"
                      style={{
                        fontWeight: 400,
                        fontSize: "0.97rem",
                        border: "none",
                        textAlign: "right",
                        paddingRight: "0",
                      }}
                    >
                      <span className="woocommerce-Price-amount amount">
                        {subtotal.toLocaleString("fr-TN", { style: "currency", currency: "TND" }).replace(",000", "")}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="pb-1 text-left align-top"
                      style={{
                        fontWeight: 400,
                        fontSize: "0.97rem",
                        border: "none",
                        textAlign: "left",
                        paddingLeft: "0",
                        verticalAlign: "top",
                      }}
                    >
                      Expédition :
                    </th>
                    <td
                      className="pb-1 text-right align-top"
                      style={{
                        fontWeight: 400,
                        fontSize: "0.97rem",
                        border: "none",
                        textAlign: "right",
                        paddingRight: "0",
                        verticalAlign: "top",
                      }}
                    >
                      <span className="woocommerce-Price-amount amount">
                        {shipping.toLocaleString("fr-TN", { style: "currency", currency: "TND" }).replace(",000", "")}
                      </span>
                      <br />
                      <small className="shipped_via text-[#888] text-xs" style={{ fontSize: "0.97rem" }}>
                        via {order?.livraison ? order.livraison : "GRAND TUNIS LIVRAISON 1/2 JRS"}
                      </small>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="pb-1 text-left"
                      style={{
                        fontWeight: 400,
                        fontSize: "0.97rem",
                        border: "none",
                        textAlign: "left",
                        paddingLeft: "0",
                      }}
                    >
                      Moyen de paiement :
                    </th>
                    <td
                      className="pb-1 text-right"
                      style={{
                        fontWeight: 400,
                        fontSize: "0.97rem",
                        border: "none",
                        textAlign: "right",
                        paddingRight: "0",
                      }}
                    >
                      {paymentMethod}
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="pt-4 text-left"
                      style={{
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        border: "none",
                        color: "#111",
                        textAlign: "left",
                        paddingLeft: "0",
                      }}
                    >
                      Total :
                    </th>
                    <td
                      className="pt-4 text-right"
                      style={{
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        border: "none",
                        color: "#111",
                        textAlign: "right",
                        paddingRight: "0",
                      }}
                    >
                      <span className="woocommerce-Price-amount amount">
                        {total.toLocaleString("fr-TN", { style: "currency", currency: "TND" }).replace(",000", "")}
                      </span>
                    </td>
                  </tr>
                  {(billing.billing_localite || billing.livraison_ville) && (
                    <tr>
                      <th
                        className="pt-4 text-left"
                        style={{
                          fontWeight: 400,
                          fontSize: "0.97rem",
                          border: "none",
                          color: "#111",
                          textAlign: "left",
                          paddingLeft: "0",
                        }}
                      >
                        {billing.billing_localite ? "billing_localite:" : "livraison_ville:"}
                      </th>
                      <td
                        className="pt-4 text-right"
                        style={{
                          fontWeight: 400,
                          fontSize: "0.97rem",
                          border: "none",
                          color: "#111",
                          textAlign: "right",
                          paddingRight: "0",
                        }}
                      >
                        {billing.billing_localite || billing.livraison_ville}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
              {/* Custom fields table */}
              {(billing.billing_localite || billing.livraison_ville) && (
                <div className="flex justify-between mt-6 text-[0.97rem]">
                  <span className="font-semibold text-[#222]">
                    {billing.billing_localite ? "billing_localite:" : "livraison_ville:"}
                  </span>
                  <span className="text-[#222]">
                    {billing.billing_localite || billing.livraison_ville}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Billing/Shipping Addresses */}
        <div className="flex justify-center w-full">
          <div
            className="flex flex-col md:flex-row gap-6 w-full px-4 md:px-0"
            style={{
              maxWidth: "1200px",
              width: "100%",
            }}
          >
            <div
              className="flex-1"
              style={{
                background: "transparent",
                borderRadius: 0,
                boxShadow: "none",
                border: "none",
                padding: 0,
              }}
            >
              <h2
                className="woocommerce-column__title mb-2"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.25rem", // reduced from 2.5rem
                  color: "#111",
                  marginBottom: "8px", // reduced from 24px
                  lineHeight: 1.1,
                }}
              >
                Adresse de facturation
              </h2>
              <address
                className="not-italic"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: "0.95rem",
                  color: "#222",
                  lineHeight: 1.4, // reduced line height for less space
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                  marginBottom: "0.5rem",
                }}
              >
                {billing.prenom} {billing.nom}
                <br />
                {billing.billing_localite || billing.livraison_ville || ""}
                {billing.code_postale || billing.livraison_code_postale ? (
                  <>
                    <br />
                    {billing.code_postale || billing.livraison_code_postale}
                  </>
                ) : null}
                {billing.phone ? (
                  <>
                    <br />
                    {billing.phone}
                  </>
                ) : null}
                {billing.email ? (
                  <>
                    <br />
                    {billing.email}
                  </>
                ) : null}
              </address>
            </div>
            <div
              className="flex-1"
              style={{
                background: "transparent",
                borderRadius: 0,
                boxShadow: "none",
                border: "none",
                padding: 0,
              }}
            >
              <h2
                className="woocommerce-column__title mb-2"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#111",
                  marginBottom: "8px",
                  lineHeight: 1.1,
                }}
              >
                Adresse de livraison
              </h2>
              <address
                className="not-italic"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: "0.95rem",
                  color: "#222",
                  lineHeight: 1.5,
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                  marginBottom: "0.5rem",
                }}
              >
                {shippingAddress.prenom} {shippingAddress.nom}
                {((shippingAddress.livraison_ville || shippingAddress.billing_localite) ||
                  (shippingAddress.livraison_code_postale || shippingAddress.code_postale)) && <br />}
                {shippingAddress.livraison_ville || shippingAddress.billing_localite || ""}
                {(shippingAddress.livraison_code_postale || shippingAddress.code_postale) && (
                  <>
                    <br />
                    {shippingAddress.livraison_code_postale || shippingAddress.code_postale}
                  </>
                )}
              </address>
            </div>
          </div>
        </div>
        {/* Toggle button */}
        <div className="my-8 text-center">
          <button
            className="bg-[#108c1c] hover:bg-[#0e7a19] text-white font-semibold px-8 py-3 rounded-[8px] shadow transition text-[16px]"
            style={{ fontFamily: "Inter, Arial, sans-serif", boxShadow: "0 2px 8px 0 rgba(16,140,28,0.10)" }}
            onClick={onShowOriginal}
          >
            Voir facture détaillée et télécharger votre document
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationReplica;