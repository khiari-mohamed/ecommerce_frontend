import React from "react";
import PacksSection from "@/components/Home/PacksSection/PacksSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packs Musculation Tunisie – Prise de Masse & Sèche à Prix Réduit | Protein.tn",
  description: "Découvrez nos packs complets pour prise de masse, sèche et performance sportive. Produits certifiés, tarifs avantageux et livraison express partout en Tunisie.",
  keywords: [
    "pack prise de masse Tunisie",
    "pack sèche musculation",
    "pack nutrition sportive",
    "packs fitness Tunisie",
    "offres groupées protéines",
    "pack compléments alimentaires Tunisie"
  ],
  openGraph: {
    title: "Packs Musculation Tunisie – Prise de Masse & Sèche à Prix Réduit | Protein.tn",
    description: "Découvrez nos packs complets pour prise de masse, sèche et performance sportive. Produits certifiés, tarifs avantageux et livraison express partout en Tunisie.",
    url: "https://www.protein.tn/packs",
    siteName: "Protein.tn",
    images: [
      {
        url: "/images/packs/pack.webp",
        width: 800,
        height: 600,
        alt: "Packs Exclusifs Protein.tn",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  alternates: {
    canonical: "/packs",
  },
};

const PacksPage = () => {
  return (
    <main>
      <PacksSection />
    </main>
  );
};

export default PacksPage;