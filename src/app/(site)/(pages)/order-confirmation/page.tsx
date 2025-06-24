import { Metadata } from "next";
import OrderConfirmationClient from "./OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Confirmation de commande | Sobitas",
  description: "Votre commande a été enregistrée avec succès sur Sobitas. Téléchargez votre facture, devis ou bon de livraison.",
  openGraph: {
    title: "Confirmation de commande | Sobitas",
    description: "Votre commande a été enregistrée avec succès sur Sobitas. Téléchargez votre facture, devis ou bon de livraison.",
    url: "https://yourdomain.com/order-confirmation",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Confirmation de commande",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Confirmation de commande | Sobitas",
    description: "Votre commande a été enregistrée avec succès sur Sobitas. Téléchargez votre facture, devis ou bon de livraison.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/order-confirmation", // Uncomment if you want to set canonical
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationClient />;
}
