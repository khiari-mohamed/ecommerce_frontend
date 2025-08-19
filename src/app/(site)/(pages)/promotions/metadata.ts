import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotions - Compléments Alimentaires en Tunisie | Protein.tn",
  description: "Découvrez nos meilleures promotions sur les compléments alimentaires en Tunisie. Réductions exceptionnelles sur protéines, vitamines et nutrition sportive. Livraison rapide.",
  keywords: [
    "promotions Tunisie",
    "compléments alimentaires promotion",
    "réduction protéines",
    "offres spéciales nutrition",
    "protein.tn promotions",
    "livraison Tunisie"
  ],
  alternates: {
    canonical: "https://www.protein.tn/promotions",
  },
  openGraph: {
    title: "Promotions - Compléments Alimentaires en Tunisie | Protein.tn",
    description: "Découvrez nos meilleures promotions sur les compléments alimentaires en Tunisie. Réductions exceptionnelles sur protéines, vitamines et nutrition sportive.",
    url: "https://www.protein.tn/promotions",
    type: "website",
    images: [
      {
        url: "https://www.protein.tn/promotions-og.jpg",
        width: 1200,
        height: 630,
        alt: "Promotions Protein.tn - Compléments Alimentaires",
      }
    ],
    siteName: "Protein.tn",
    locale: "fr_TN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promotions - Compléments Alimentaires en Tunisie | Protein.tn",
    description: "Découvrez nos meilleures promotions sur les compléments alimentaires en Tunisie. Réductions exceptionnelles sur protéines et nutrition sportive.",
    images: ["https://www.protein.tn/promotions-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};