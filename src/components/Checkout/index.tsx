"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Billing, { initialState as billingInitialState } from "./Billing";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";
import { createOrder } from "@/services/orders";
import type { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import Login from "./Login";
import Link from "next/link";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const fraisLivraison = 10;

// Enhanced image URL with backend fallback for new images
const getEnhancedImageSrc = (src: string) => {
  // Check if this is a NEW backend-served image (contains August2025 pattern)
  if (src && src.includes('August2025')) {
    const backendUrl = 'http://145.223.118.9:5000';
    return `${backendUrl}${src}`;
  }
  
  return src;
};

const Checkout = () => {
  const cart = useAppSelector((state) => state.cartReducer.items);

  const [billingInfo, setBillingInfo] = useState(billingInitialState);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("payme");
  const [coupon, setCoupon] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Mount effect
  }, []);

  useEffect(() => {
    // Payment method changed
  }, [selectedPayment]);

  useEffect(() => {
    async function fetchRecommendation(excludeCart = true) {
      // If cart is empty, still try to fetch a product (fallback)
      const cartIds = excludeCart && cart && cart.length > 0
        ? cart.map((item: any) => String(item._id ?? item.id))
        : [];
      try {
        const res = await axios.post(`${API_BASE}/products/recommendation`, { exclude: cartIds });
        let product = null;
        if (res.data && typeof res.data === "object" && "product" in res.data) {
          product = res.data.product;
        }
        // If no product found, try fallback (no exclusions)
        if (!product && excludeCart) {
          fetchRecommendation(false);
        } else {
          setRecommended(product || null);
        }
      } catch (err) {
        // On error, try fallback once
        if (excludeCart) {
          fetchRecommendation(false);
        } else {
          setRecommended(null);
        }
      }
    }
    fetchRecommendation();
  }, [cart]);

  const sousTotal = cart.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
    0
  );
  const total = sousTotal + fraisLivraison;

  const generateOrderNumber = () => {
    return "CMD-" + Math.floor(100000 + Math.random() * 900000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date().toISOString();

    // Map new billing fields to backend order fields
    const orderData: Omit<Order, "id"> = {
      prix_ht: sousTotal.toString(),
      prix_ttc: total.toString(),
      created_at: now,
      updated_at: now,
      etat: "nouvelle_commande",
      nom: billingInfo.lastName,
      prenom: billingInfo.firstName,
      code_postale: billingInfo.codePostal,
      email: billingInfo.email,
      phone: billingInfo.phone,
      note: notes,
      livraison: selectedShipping,
      frais_livraison: fraisLivraison.toString(),
      numero: generateOrderNumber(),
      remise: coupon || "",
      paymentMethod: selectedPayment,
      cart: cart,
      type: "",
      pays: "Tunisie", // <-- Add this line
      billing_localite: billingInfo.localite,
      gouvernorat: billingInfo.gouvernorat,
    };

    try {
      await createOrder(orderData);

      if (selectedPayment === "payme") {
        const response = await axios.post(`${API_BASE}/payments/payme/create`, {
          amount: total,
          note: `Commande ${orderData.numero}`,
          first_name: billingInfo.firstName,
          last_name: billingInfo.lastName,
          email: billingInfo.email,
          phone: billingInfo.phone,
          return_url: `https://protein.tn/order-confirmation?orderNumber=${orderData.numero}`,
          cancel_url: "https://protein.tn/checkout",
          webhook_url: "https://145.223.118.9:5000/payments/payme/webhook",
          order_id: orderData.numero,
        });

        const paymentUrl = response.data.payment_url || response.data;
        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        } else {
          toast.error("Erreur lors de la génération du lien de paiement Paymee.");
        }
      } else if (selectedPayment === "cash") {
        window.location.href = `https://protein.tn/order-confirmation?orderNumber=${orderData.numero}`;
        return;
      }
    } catch (err: any) {
      toast.error("Échec de lenvoi de la commande");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Shopping Cart" },
    { label: "Shipping and Checkout" },
    { label: "Confirmation" },
  ];

  return (
    <div className="checkout-page">
      {/* Site Branding Bar */}
      <div
        className="site-branding w-full bg-white border-b border-[#e5e5e5] flex items-center justify-start px-4 sm:px-8"
        style={{
          padding: "12px 0",
          zIndex: 20,
          minHeight: 64,
        }}
      >
        {/* Menu button: show only on mobile */}
        <button
          className="menu-toggle flex flex-col items-center mr-6 lg:hidden"
          aria-label="Menu"
          aria-controls="site-navigation"
          aria-expanded="false"
          style={{
            background: "none",
            border: "none",
            outline: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span className="bar" style={{
            display: "block",
            width: 24,
            height: 3,
            background: "#1a237e",
            margin: "3px 0",
            borderRadius: 2
          }}></span>
          <span className="bar" style={{
            display: "block",
            width: 24,
            height: 3,
            background: "#1a237e",
            margin: "3px 0",
            borderRadius: 2
          }}></span>
          <span className="bar" style={{
            display: "block",
            width: 24,
            height: 3,
            background: "#1a237e",
            margin: "3px 0",
            borderRadius: 2
          }}></span>
          <span className="bar-text" style={{
            fontSize: 11,
            color: "#1a237e",
            fontWeight: 700,
            letterSpacing: 1,
            marginTop: 2
          }}>MENU</span>
        </button>
        {/* Logo: left-aligned with margin */}
        <Link
        href="/"
        className="custom-logo-link flex items-center h-8 sm:h-10 ml-0 sm:ml-6 md:ml-12 lg:ml-24"
        >
        <img
        width={180}
        height={46}
        src="/images/logo/logo.png"
        className="custom-logo h-8 sm:h-10 w-auto max-w-full"
        alt="Votre Logo"
        />
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="bg-white py-4 px-2 sm:px-8 flex flex-col items-center border-b border-gray-200">
        <div className="max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-[1170px] w-full mx-auto px-2 sm:px-4 md:px-8 xl:px-0">
          <div
            id="commercekit-timer-message"
            className="non-product checkout"
            style={{
              display: "block",
              background: "#f8f6db",
              color: "#111",
              borderRadius: "8px",
              padding: "14px 18px",
              fontWeight: 500,
              fontSize: "1rem",
              textAlign: "center",
              marginBottom: "12px"
            }}
          >
            Temps écoulé ! Mais nous avons prolongé l&apos;état de ta commande 🙂
          </div>
        </div>
        <div className="w-full max-w-2xl relative flex items-center justify-between mt-2" style={{minHeight: 56}}>
        {/* Continuous line behind circles */}
      <div
  style={{
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '1px',
    background: '#3074cc',
    zIndex: 1,
    transform: 'translateY(-50%)',
    // Add this to ensure perfect centering:
   
  }}
></div>
        {steps.map((step, idx) => {
        const isActive = idx === 1;
        const isCompleted = idx < 1;
        return (
        <div key={step.label} className="flex-1 flex flex-col items-center z-10" style={{position: 'relative' , marginTop: '24px'}}>
        <div
        className="rounded-full w-8 h-8 flex items-center justify-center border-2 font-bold text-base"
        style={{ background: '#111', borderColor: '#111', color: '#fff' }}
        
        >
        {isCompleted ? <FaCheckCircle className="text-white" /> : idx + 1}
        </div>
        <span
        className="mt-2 text-xs sm:text-sm font-medium"
        style={{ minWidth: 80, textAlign: "center", color: "#111" }}
        >
        {step.label}
        </span>
        </div>
        );
        })}
        </div>
      </div>

      {/* Login Section */}
      <div className="max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-[1170px] w-full mx-auto px-2 sm:px-4 md:px-8 xl:px-0 mt-8">
        <Login />
      </div>
      {/* SOBITAS Fidelity Section - separate container */}
      <div
      className="max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-[1170px] w-full mx-auto px-2 sm:px-4 md:px-8 xl:px-0 mt-3"
      >
      <div className="bg-[#f08c14] rounded-lg py-2 px-3 flex items-center w-full">
        <span className="text-white font-medium text-xs sm:text-sm w-full break-words leading-tight">
          Connecte-toi sur{' '}
          <Link
            href="/account"
            className="underline text-[#fff] hover:no-underline transition font-bold"
          >
            MonCompte
          </Link>{' '}
          et profite pleinement du Programme SOBITAS Fidélité
        </span>
      </div>
      </div>

      <section className="overflow-hidden py-10 sm:py-16 md:py-20 bg-gray-2">
        <div className="max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-[1170px] w-full mx-auto px-2 sm:px-4 md:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-7.5 xl:gap-11 lg:flex-row">
              {/* Colonne gauche */}
              <div className="w-full lg:max-w-[670px] min-w-0">
                <Billing value={billingInfo} onChange={setBillingInfo} />
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5" style={{ color: '#000' }}>
                      Autres remarques (optionnel)
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Remarques sur votre commande, ex : instructions spéciales pour la livraison."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>
              {/* Colonne droite */}
              <div className="w-full lg:max-w-[455px] min-w-0 mt-7.5 lg:mt-0">
                <div className="bg-white shadow-1 rounded-[10px] overflow-hidden">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-lg sm:text-xl text-dark">
                      Votre commande
                    </h3>
                  </div>
                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* Products */}
                    {cart.map((item, idx) => (
                      <div
                        key={typeof item.id === "number" && Number.isFinite(item.id) ? `cart-item-${item.id}` : `cart-item-${idx}`}
                        className="flex items-center gap-4 py-4 border-b border-gray-3"
                      >
                        {/* Cart product image */}
                        <img
                          src={getEnhancedImageSrc(
                            item.cover && item.cover.startsWith("http")
                              ? item.cover
                              : item.cover
                              ? "/" + item.cover.replace(/^\/+/, "")
                              : item.mainImage?.url && item.mainImage.url.startsWith("http")
                              ? item.mainImage.url
                              : item.mainImage?.url
                              ? "/" + item.mainImage.url.replace(/^\/+/, "")
                              : item.images && item.images.length > 0 && item.images[0].url && item.images[0].url.startsWith("http")
                              ? item.images[0].url
                              : item.images && item.images.length > 0 && item.images[0].url
                              ? "/" + item.images[0].url.replace(/^\/+/, "")
                              : "/placeholder.png"
                          )}
                          alt={item.title || item.designation_fr || item.designation || "Produit"}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-dark text-sm sm:text-base">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.title} &times; {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium text-dark text-right min-w-[70px]">
                          {Number((item.discountedPrice || item.price) * item.quantity).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                        </div>
                      </div>
                    ))}

                    {/* Sous-total */}
                    <div className="flex items-center justify-between py-4 border-b border-gray-3 text-sm">
                      <span className="text-dark">Sous-total</span>
                      <span className="text-dark">
                        {sousTotal.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                      </span>
                    </div>

                    {/* Expédition */}
                    <div className="flex items-center justify-between py-4 border-b border-gray-3 text-sm">
                      <span className="text-dark">Expédition</span>
                      <span className="text-dark text-right block w-full">
                        {billingInfo.codePostal && billingInfo.gouvernorat
                          ? fraisLivraison.toLocaleString("fr-TN", { style: "currency", currency: "TND" })
                          : <span className="text-gray-500">Saisissez votre adresse pour voir les options de livraison.</span>
                        }
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between py-4 border-b border-gray-3 text-base font-semibold">
                      <span className="text-dark">Total</span>
                      <span className="text-dark">
                        {Number(total).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                      </span>
                    </div>

                    {/* Payment Methods */}
                    <div className="mt-6">
                      <div className="mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value="cash"
                            checked={selectedPayment === "cash"}
                            onChange={() => setSelectedPayment("cash")}
                            className="accent-[#FF4301]"
                          />
                          <span className="font-medium text-dark">Paiement à la livraison</span>
                        </label>
                        <div className="ml-6 text-xs text-gray-600 mt-1">
                          Payez en argent comptant à la livraison.
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value="payme"
                            checked={selectedPayment === "payme"}
                            onChange={() => setSelectedPayment("payme")}
                            className="accent-[#FF4301]"
                          />
                          <span className="font-medium text-dark flex items-center gap-2">
                            Carte Bancaire
                            <img
                              src="/images/icons/paymee-logo.png"
                              alt="Carte Bancaire"
                              className="h-5"
                              style={{ display: "inline-block" }}
                            />
                          </span>
                        </label>
                        <div className="ml-6 text-xs text-gray-600 mt-1">
                          Les commandes réglées par CB sont traitées en priorité sans confirmation, livrées gratuitement sans frais et apportent 25 points de fidélité pour les clients enregistrés.
                        </div>
                      </div>
                    </div>

                    {/* CGV Checkbox */}
                    <div className="mt-6 flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="cgv"
                        required
                        className="accent-[#FF4301] mt-1"
                      />
                      <label htmlFor="cgv" className="text-xs text-dark">
                        J&apos;ai lu et j&apos;accepte les
                        <Link href="/conditions-generales" className="underline text-[#FF4301]" target="_blank" rel="noopener noreferrer">conditions générales</Link> <span className="text-[#FF4301]">*</span>
                      </label>
                    </div>

                    {/* Upsell Section (optional, demo only) */}
                    <div className="mt-8 bg-gray-100 rounded p-4">
                      <div className="font-medium text-dark mb-2">Ceci pourrait t&apos;intéresser</div>
                      {recommended ? (
                        <div className="flex items-center gap-4">
                          {/* Recommendation image */}
                          <img
                            src={getEnhancedImageSrc(
                              recommended.cover && recommended.cover.startsWith("http")
                                ? recommended.cover
                                : recommended.cover
                                ? "/" + recommended.cover.replace(/^\/+/, "")
                                : recommended.mainImage?.url && recommended.mainImage.url.startsWith("http")
                                ? recommended.mainImage.url
                                : recommended.mainImage?.url
                                ? "/" + recommended.mainImage.url.replace(/^\/+/, "")
                                : recommended.images && recommended.images.length > 0 && recommended.images[0].url && recommended.images[0].url.startsWith("http")
                                ? recommended.images[0].url
                                : recommended.images && recommended.images.length > 0 && recommended.images[0].url
                                ? "/" + recommended.images[0].url.replace(/^\/+/, "")
                                : "/placeholder.png"
                            )}
                            alt={recommended.designation_fr || recommended.designation || "Produit"}
                            className="w-14 h-14 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="text-sm text-dark">
                              {recommended.designation_fr || recommended.designation}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(() => {
                                // Prefer promo if its a positive number, else fallback to price/prix
                                const promo = Number(recommended?.promo);
                                const price = Number(recommended?.price ?? recommended?.prix);
                                const displayPrice =
                                  !isNaN(promo) && promo > 0
                                    ? promo
                                    : !isNaN(price) && price > 0
                                    ? price
                                    : 0;
                                return displayPrice.toLocaleString("fr-TN", { style: "currency", currency: "TND" });
                              })()}
                            </div>
                          </div>
                          <Link
                          href={`/shop/${recommended.slug}`}
                          className="bg-[#FF4301] text-white text-xs px-3 py-1 rounded hover:bg-[#e03c00] transition"
                          >
                          J&apos;achète
                          </Link>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">Aucune recommandation disponible.</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center font-medium text-white py-3 px-6 rounded-md ease-out duration-200 mt-7.5"
                    style={{ backgroundColor: '#3074fc', border: 'none' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#255dcc')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#3074fc')}
                    disabled={loading}
                  >
                    {loading ? "Traitement..." : "Commander"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Debug: show cart image paths */}
          {cart.map((item, idx) => (
            <div key={idx} style={{ display: "none" }}>
              {JSON.stringify(item.cover)}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Checkout;