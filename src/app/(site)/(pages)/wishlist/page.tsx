import React from "react";
import { Wishlist } from "@/components/Wishlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liste de souhaits | Sobitas",
  description: "Gérez vos produits favoris dans votre liste de souhaits Sobitas.",
  openGraph: {
    title: "Liste de souhaits | Sobitas",
    description: "Gérez vos produits favoris dans votre liste de souhaits Sobitas.",
    url: "https://yprotein.tn/wishlist",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yprotein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Liste de souhaits",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liste de souhaits | Sobitas",
    description: "Gérez vos produits favoris dans votre liste de souhaits Sobitas.",
    images: ["https://yprotein.tn/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yprotein.tn/wishlist", 
};

const WishlistPage = () => {
  return (
    <main>
      <Wishlist />
    </main>
  );
};

export default WishlistPage;
