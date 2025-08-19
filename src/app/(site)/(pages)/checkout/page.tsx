import React from "react";
import Checkout from "@/components/Checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement | Sobitas",
  description: "Finalisez votre commande et procédez au paiement sur Sobitas.",
  openGraph: {
    title: "Paiement | Sobitas",
    description: "Finalisez votre commande et procédez au paiement sur Sobitas.",
    url: "https://protein.tn/checkout",
    siteName: "Sobitas",
    images: [
      {
        url: "https://protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Paiement",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paiement | Sobitas",
    description: "Finalisez votre commande et procédez au paiement sur Sobitas.",
    images: ["https://protein.tn/og-image.jpg"],
  },
  robots: "index, follow",
  keywords: ["paiement Sobitas", "finaliser commande", "acheter en ligne Tunisie", "checkout Protein.tn"],
  // canonical: "https://protein.tn/checkout",
};

const CheckoutPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;
