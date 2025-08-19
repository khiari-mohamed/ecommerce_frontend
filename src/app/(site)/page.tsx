import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vente de Compléments Alimentaires & Matériel Musculation | Protein.tn",
  description: "Spécialiste en compléments alimentaires et matériel de musculation en Tunisie. Whey, Créatine, BCAA, et plus. Livraison rapide sur toute la Tunisie.",
  openGraph: {
    title: "Vente de Compléments Alimentaires & Matériel Musculation | Protein.tn",
    description: "Spécialiste en compléments alimentaires et matériel de musculation en Tunisie. Whey, Créatine, BCAA, et plus. Livraison rapide sur toute la Tunisie.",
    url: "https://www.protein.tn/",
    siteName: "Sobitas - Protein.tn",
    images: [
      {
        url: "https://www.protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Boutique e-commerce Protein.tn",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vente de Compléments Alimentaires & Matériel Musculation | Protein.tn",
    description: "Spécialiste en compléments alimentaires et matériel de musculation en Tunisie. Whey, Créatine, BCAA, et plus. Livraison rapide sur toute la Tunisie.",
    images: ["https://www.protein.tn/og-image.jpg"],
  },
  robots: "index, follow",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}