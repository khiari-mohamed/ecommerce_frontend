import { Metadata } from "next";
import AllProductsClient from "./AllProductsClient";

export const metadata: Metadata = {
  title: "Acheter Whey, Créatine, BCAA & Compléments Alimentaires en Tunisie | Protein.tn",
  description: "Découvrez notre gamme complète de compléments alimentaires : whey, créatine, BCAA, vitamines et accessoires sportifs. Livraison express partout en Tunisie.",
  keywords: ["acheter complément alimentaire Tunisie", "whey Tunisie", "créatine Tunisie", "BCAA Tunisie", "nutrition sportive Tunisie", "protéines en ligne Tunisie"],
  openGraph: {
    title: "Acheter Whey, Créatine, BCAA & Compléments Alimentaires en Tunisie | Protein.tn",
    description: "Découvrez notre gamme complète de compléments alimentaires : whey, créatine, BCAA, vitamines et accessoires sportifs. Livraison express partout en Tunisie.",
    url: "https://protein.tn/products",
    siteName: "Sobitas",
    images: [
      {
        url: "https://protein.tn/og-image.jpg",
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
    images: ["https://protein.tn/og-image.jpg"],
  },
  robots: "index, follow",
  
};

export default function ProductsPage() {
  return <AllProductsClient />;
}
