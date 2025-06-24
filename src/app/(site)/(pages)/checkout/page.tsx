import React from "react";
import Checkout from "@/components/Checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement | Sobitas",
  description: "Finalisez votre commande et procédez au paiement sur Sobitas.",
  openGraph: {
    title: "Paiement | Sobitas",
    description: "Finalisez votre commande et procédez au paiement sur Sobitas.",
    url: "https://yourdomain.com/checkout",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
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
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/checkout", // Uncomment if you want to set canonical
};

const CheckoutPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;
