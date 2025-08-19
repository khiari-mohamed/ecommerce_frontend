import React from "react";
import Cart from "@/components/Cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Votre Panier d'Achat | Protein.tn",
  description: "Vérifiez les articles dans votre panier avant de finaliser votre commande de compléments alimentaires et matériel de sport sur Protein.tn.",
  openGraph: {
    title: "Votre Panier d'Achat | Protein.tn",
    description: "Vérifiez les articles dans votre panier avant de finaliser votre commande.",
    url: "https://www.protein.tn/cart",
    siteName: "Sobitas - Protein.tn",
    images: [
      {
        url: "https://www.protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Panier d'achat sur Protein.tn",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  robots: "noindex, follow", // Important pour les pages de panier
};

const CartPage = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;