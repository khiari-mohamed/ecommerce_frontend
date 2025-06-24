import { Metadata } from "next";
import OrdersDemoClient from "./OrdersDemoClient";

export const metadata: Metadata = {
  title: "Commandes | Sobitas",
  description: "Gérez et visualisez toutes vos commandes sur Sobitas. Accédez aux détails, modifiez ou consultez vos commandes facilement.",
  openGraph: {
    title: "Commandes | Sobitas",
    description: "Gérez et visualisez toutes vos commandes sur Sobitas. Accédez aux détails, modifiez ou consultez vos commandes facilement.",
    url: "https://yourdomain.com/orders",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Commandes",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commandes | Sobitas",
    description: "Gérez et visualisez toutes vos commandes sur Sobitas. Accédez aux détails, modifiez ou consultez vos commandes facilement.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/orders", // Uncomment if you want to set canonical
};

export default function OrdersPage() {
  return <OrdersDemoClient />;
}
