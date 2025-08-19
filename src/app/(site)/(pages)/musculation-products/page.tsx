import { Metadata } from "next";
import MusculationProductsClient from "./MusculationProductsClient";

export const metadata: Metadata = {
  title: "Matériel de Musculation en Tunisie | Protein.tn",
  description: "Découvrez notre gamme complète de matériel de musculation en Tunisie. Équipements de qualité professionnelle, prix compétitifs et livraison rapide sur tout le territoire tunisien.",
  keywords: [
    "matériel musculation Tunisie",
    "équipement fitness Tunisie",
    "haltères Tunisie",
    "banc musculation",
    "protein.tn",
    "sport Tunisie",
    "livraison Tunisie"
  ],
  alternates: {
    canonical: "https://www.protein.tn/musculation-products",
  },
  openGraph: {
    title: "Matériel de Musculation en Tunisie | Protein.tn",
    description: "Découvrez notre gamme complète de matériel de musculation en Tunisie. Équipements de qualité professionnelle, prix compétitifs et livraison rapide sur tout le territoire tunisien.",
    url: "https://www.protein.tn/musculation-products",
    siteName: "Protein.tn",
    images: [
      {
        url: "https://www.protein.tn/musculation-og.jpg",
        width: 1200,
        height: 630,
        alt: "Protein.tn - Matériel de Musculation en Tunisie",
      },
    ],
    locale: "fr_TN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matériel de Musculation en Tunisie | Protein.tn",
    description: "Découvrez notre gamme complète de matériel de musculation en Tunisie. Équipements de qualité professionnelle, prix compétitifs et livraison rapide.",
    images: ["https://www.protein.tn/musculation-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default function MusculationProductsPage() {
  return <MusculationProductsClient />;
}
