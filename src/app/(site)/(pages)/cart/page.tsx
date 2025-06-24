import React from "react";
import Cart from "@/components/Cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panier | Sobitas",
  description: "Consultez et gérez les produits dans votre panier sur Sobitas avant de passer à la commande.",
  openGraph: {
    title: "Panier | Sobitas",
    description: "Consultez et gérez les produits dans votre panier sur Sobitas avant de passer à la commande.",
    url: "https://yourdomain.com/cart",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Panier",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Panier | Sobitas",
    description: "Consultez et gérez les produits dans votre panier sur Sobitas avant de passer à la commande.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/cart", // Uncomment if you want to set canonical
};

const CartPage = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;
