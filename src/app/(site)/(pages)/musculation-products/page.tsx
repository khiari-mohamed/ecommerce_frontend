import { Metadata } from "next";
import MusculationProductsClient from "./MusculationProductsClient";

export const metadata: Metadata = {
  title: "Matériel de Musculation | Sobitas",
  description: "Découvrez notre sélection de matériel de musculation sur Sobitas. Équipez-vous pour vos entraînements à domicile ou en salle.",
  openGraph: {
    title: "Matériel de Musculation | Sobitas",
    description: "Découvrez notre sélection de matériel de musculation sur Sobitas. Équipez-vous pour vos entraînements à domicile ou en salle.",
    url: "https://yourdomain.com/musculation-products",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Matériel de Musculation",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matériel de Musculation | Sobitas",
    description: "Découvrez notre sélection de matériel de musculation sur Sobitas. Équipez-vous pour vos entraînements à domicile ou en salle.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/musculation-products", // Uncomment if you want to set canonical
};

export default function MusculationProductsPage() {
  return <MusculationProductsClient />;
}
