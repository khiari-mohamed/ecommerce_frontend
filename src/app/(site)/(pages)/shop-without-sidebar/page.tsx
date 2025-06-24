import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique | Sobitas",
  description: "Parcourez la boutique Sobitas et découvrez nos produits sans filtre latéral.",
  openGraph: {
    title: "Boutique | Sobitas",
    description: "Parcourez la boutique Sobitas et découvrez nos produits sans filtre latéral.",
    url: "https://yourdomain.com/shop-without-sidebar",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Boutique",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boutique | Sobitas",
    description: "Parcourez la boutique Sobitas et découvrez nos produits sans filtre latéral.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/shop-without-sidebar", // Uncomment if you want to set canonical
};

const ShopWithoutSidebarPage = () => {
  return (
    <main>
      <ShopWithoutSidebar />
    </main>
  );
};

export default ShopWithoutSidebarPage;
