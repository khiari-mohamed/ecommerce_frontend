import { Metadata } from "next";
import ListAllSubcategories from "@/components/Subcategory/ListAllSubcategories";

export const metadata: Metadata = {
  title: "Sous-catégories | Sobitas",
  description: "Découvrez toutes les sous-catégories de produits disponibles sur Sobitas.",
  openGraph: {
    title: "Sous-catégories | Sobitas",
    description: "Découvrez toutes les sous-catégories de produits disponibles sur Sobitas.",
    url: "https://yourdomain.com/subcategories",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Sous-catégories",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sous-catégories | Sobitas",
    description: "Découvrez toutes les sous-catégories de produits disponibles sur Sobitas.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/subcategories", // Uncomment if you want to set canonical
};

export default function SubcategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <ListAllSubcategories />
    </div>
  );
}
