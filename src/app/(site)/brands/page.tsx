import axios from "@/lib/axios";
import BrandsPageClient from "./BrandsPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marques Compléments Alimentaires Tunisie – Optimum Nutrition, Muscletech & Plus | Protein.tn",
  description: "Retrouvez les meilleures marques certifiées comme Optimum Nutrition, Muscletech, BSN et Dymatize. Produits originaux, livraison rapide et prix compétitifs en Tunisie.",
  keywords: ["optimum nutrition Tunisie", "muscletech Tunisie", "bsn Tunisie", "dymatize Tunisie", "marques compléments alimentaires Tunisie", "marques certifiées nutrition sportive"],
  openGraph: {
    title: "Marques Compléments Alimentaires Tunisie – Optimum Nutrition, Muscletech & Plus | Protein.tn",
    description: "Retrouvez les meilleures marques certifiées comme Optimum Nutrition, Muscletech, BSN et Dymatize. Produits originaux, livraison rapide et prix compétitifs en Tunisie.",
    url: "https://www.protein.tn/brands",
    siteName: "Protein.tn",
    images: [
      {
        url: "https://www.protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marques de compléments alimentaires | Protein.tn",
      },
    ],
    locale: "fr_TN",
    type: "website",
  },
};

// Helper to fetch brands
async function getBrands() {
  try {
    const res = await axios.get("/brands");
    return res.data || [];
  } catch {
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getBrands();
  return <BrandsPageClient brands={brands} />;
}
