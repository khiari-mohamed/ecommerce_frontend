import { Metadata } from "next";
import AllProductsClient from "./AllProductsClient";

export const metadata: Metadata = {
  title: "Tous les produits | Sobitas",
  description: "Découvrez tous les produits disponibles sur Sobitas. Parcourez notre large sélection de marques et de catégories.",
  openGraph: {
    title: "Tous les produits | Sobitas",
    description: "Découvrez tous les produits disponibles sur Sobitas. Parcourez notre large sélection de marques et de catégories.",
    url: "https://yourdomain.com/products",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Tous les produits",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tous les produits | Sobitas",
    description: "Découvrez tous les produits disponibles sur Sobitas. Parcourez notre large sélection de marques et de catégories.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/products", // Uncomment if you want to set canonical
};

export default function ProductsPage() {
  return <AllProductsClient />;
}
