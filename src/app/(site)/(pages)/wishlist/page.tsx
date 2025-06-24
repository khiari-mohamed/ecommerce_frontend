import React from "react";
import { Wishlist } from "@/components/Wishlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liste de souhaits | Sobitas",
  description: "Gérez vos produits favoris dans votre liste de souhaits Sobitas.",
  openGraph: {
    title: "Liste de souhaits | Sobitas",
    description: "Gérez vos produits favoris dans votre liste de souhaits Sobitas.",
    url: "https://yourdomain.com/wishlist",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
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
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/wishlist", // Uncomment if you want to set canonical
};

const WishlistPage = () => {
  return (
    <main>
      <Wishlist />
    </main>
  );
};

export default WishlistPage;
