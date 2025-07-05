"use client";
import React, { useState, useEffect } from "react";
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
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const fraisLivraison = 10;

const Checkout = () => {
  // Utiliser le panier Redux
  const cart = useAppSelector((state) => state.cartReducer.items);

  // États contrôlés pour la facturation, livraison, etc.
  const [billingInfo, setBillingInfo] = useState(billingInitialState);
  // const [shippingInfo, setShippingInfo] = useState();
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  // Force Paymee as the default payment method for testing
  const [selectedPayment, setSelectedPayment] = useState<string>("payme");
  const [coupon, setCoupon] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Component mounted.");
  }, []);

  useEffect(() => {
    console.log("selectedPayment changed:", selectedPayment);
  }, [selectedPayment]);

  const sousTotal = cart.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
    0
  );
  const total = sousTotal + fraisLivraison;

  // Helper: Generate a random order number (numero)
  const generateOrderNumber = () => {
    return "CMD-" + Math.floor(100000 + Math.random() * 900000);
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date().toISOString();

    const orderData: Omit<Order, "id"> = {
      prix_ht: sousTotal.toString(),
      prix_ttc: total.toString(),
      created_at: now,
      updated_at: now,
      etat: "nouvelle_commande",
      nom: billingInfo.lastName,
      prenom: billingInfo.firstName,
      adresse1: billingInfo.address,
      adresse2: billingInfo.addressTwo,
      email: billingInfo.email,
      phone: billingInfo.phone,
      pays: billingInfo.country,
      region: billingInfo.countryName,
      ville: billingInfo.town,
      code_postale: "",
      note: notes,
      livraison: selectedShipping,
      frais_livraison: fraisLivraison.toString(),
      livraison_nom: "",
      livraison_prenom: "",
      livraison_adresse1: "",
      livraison_adresse2: "",
      livraison_email: "",
      livraison_phone: "",
      livraison_pays: "",
      livraison_region: "",
      livraison_ville: "",
      livraison_code_postale: "",
      numero: generateOrderNumber(),
      historique: "",
      remise: coupon || "",
      paymentMethod: selectedPayment,
      cart: cart,
      type: ""
    };

    try {
      console.log("Form submitted!");
      console.log("Selected payment method:", selectedPayment);
      console.log("Order data:", orderData);

      // Always force Paymee redirect for testing
      await createOrder(orderData);

      console.log("Initiating Paymee payment...");
      const response = await axios.post(`${API_BASE}/payments/payme/create`, {
        amount: total,
        note: `Commande ${orderData.numero}`,
        first_name: billingInfo.firstName,
        last_name: billingInfo.lastName,
        email: billingInfo.email,
        phone: billingInfo.phone,
        return_url: "https://ecommerce-frontend-ruby-eta.vercel.app/facture",
        cancel_url: "https://ecommerce-frontend-ruby-eta.vercel.app/checkout",
        webhook_url: "https://ecommercebakcned-production.up.railway.app/payments/payme/webhook",
        order_id: orderData.numero,
      });

      console.log("Paymee backend response:", response.data);

      const paymentUrl = response.data.payment_url || response.data;
      if (paymentUrl) {
        console.log("Redirecting to Paymee payment URL:", paymentUrl);
        window.location.href = paymentUrl;
        return;
      } else {
        toast.error("Erreur lors de la génération du lien de paiement Paymee.");
        console.error("No paymentUrl received from backend.");
      }
    } catch (err: any) {
      toast.error("Échec de l'envoi de la commande");
      console.error("Error during Paymee payment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Paiement"} pages={["paiement"]} />
      <section className="overflow-hidden py-10 sm:py-16 md:py-20 bg-gray-2">
        <div className="max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-[1170px] w-full mx-auto px-2 sm:px-4 md:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-7.5 xl:gap-11 lg:flex-row">
              {/* <!-- Colonne gauche --> */}
              <div className="w-full lg:max-w-[670px] min-w-0">
                <Billing value={billingInfo} onChange={setBillingInfo} />
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5" style={{ color: '#FF4301' }}>
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
              {/* <!-- Colonne droite --> */}
              <div className="w-full lg:max-w-[455px] min-w-0 mt-7.5 lg:mt-0">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-lg sm:text-xl text-dark">
                      Votre commande
                    </h3>
                  </div>
                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex flex-col sm:flex-row items-center justify-between py-5 border-b border-gray-3 text-xs sm:text-base gap-2">
                      <div>
                        <h4 className="font-medium text-dark">Produit</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Total
                        </h4>
                      </div>
                    </div>
                    {cart.map((item, idx) => (
                      <div
                        key={typeof item.id === "number" && Number.isFinite(item.id) ? `cart-item-${item.id}` : `cart-item-${idx}`}
                        className="flex flex-col sm:flex-row items-center justify-between py-5 border-b border-gray-3 text-xs sm:text-base gap-2"
                      >
                        <div className="w-full sm:w-auto">
                          <p className="text-dark break-words">{item.title}</p>
                        </div>
                        <div className="w-full sm:w-auto">
                          <p className="text-dark text-right">
                            {Number((item.discountedPrice || item.price) * item.quantity).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col sm:flex-row items-center justify-between py-5 border-b border-gray-3 text-xs sm:text-base gap-2">
                      <div>
                        <p className="text-dark">Frais de livraison</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">
                          {fraisLivraison.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-5 text-xs sm:text-base gap-2">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          {Number(total).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-7.5">
                  <ShippingMethod value={selectedShipping} onChange={setSelectedShipping} />
                </div>
                <div className="mt-7.5">
                  <PaymentMethod value={selectedPayment} onChange={setSelectedPayment} />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white py-3 px-6 rounded-md ease-out duration-200 mt-7.5"
                  style={{ backgroundColor: '#FF4301', border: 'none' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#e03c00')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#FF4301')}
                  disabled={loading}
                >
                  {loading ? "Traitement..." : "Valider la commande"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;