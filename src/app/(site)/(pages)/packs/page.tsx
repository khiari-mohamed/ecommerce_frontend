
import React from "react";
import PacksSection from "@/components/Home/PacksSection/PacksSection";
import type { Metadata } from "next";

// Static metadata export for SEO
export const metadata: Metadata = {
  title: "Packs Exclusifs | Protein.tn",
  description:
    "Découvrez nos packs exclusifs pour la musculation, la prise de masse, la sèche et plus encore. Profitez des meilleures offres et promotions sur Protein.tn.",
  keywords: [
    "packs musculation",
    "packs prise de masse",
    "packs sèche",
    "nutrition sportive",
    "Protein.tn",
  ],
  openGraph: {
    title: "Packs Exclusifs | Protein.tn",
    description:
      "Découvrez nos packs exclusifs pour la musculation, la prise de masse, la sèche et plus encore. Profitez des meilleures offres et promotions sur Protein.tn.",
    url: "https://protein.tn/packs",
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
};

const PacksPage = () => {
  return (
    <main>
      <PacksSection />
    </main>
  );
};

export default PacksPage;