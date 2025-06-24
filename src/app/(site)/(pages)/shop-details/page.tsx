import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Détails de la boutique | Sobitas",
  description: "Découvrez les informations détaillées sur la boutique Sobitas, ses coordonnées et ses services.",
  openGraph: {
    title: "Détails de la boutique | Sobitas",
    description: "Découvrez les informations détaillées sur la boutique Sobitas, ses coordonnées et ses services.",
    url: "https://yourdomain.com/shop-details",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Détails de la boutique",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Détails de la boutique | Sobitas",
    description: "Découvrez les informations détaillées sur la boutique Sobitas, ses coordonnées et ses services.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/shop-details", // Uncomment if you want to set canonical
};

const ShopDetailsPage = () => {
  return (
    <main>
      <ShopDetails />
    </main>
  );
};

export default ShopDetailsPage;
