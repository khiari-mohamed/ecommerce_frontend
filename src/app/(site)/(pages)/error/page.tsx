import React from "react";
import Error from "@/components/Error";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erreur | Sobitas",
  description: "Une erreur s'est produite sur Sobitas. Veuillez réessayer ou contacter le support.",
  openGraph: {
    title: "Erreur | Sobitas",
    description: "Une erreur s'est produite sur Sobitas. Veuillez réessayer ou contacter le support.",
    url: "https://protein.tn/error",
    siteName: "Sobitas",
    images: [
      {
        url: "https://protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Erreur",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Erreur | Sobitas",
    description: "Une erreur s'est produite sur Sobitas. Veuillez réessayer ou contacter le support.",
    images: ["https://protein.tn/og-image.jpg"],
  },
 
  robots: "noindex, nofollow",
  // ✅ Optional canonical (not necessary for error pages, but possible)
  // canonical: "https://protein.tn/error",
};

const ErrorPage = () => {
  return (
    <main>
      <Error />
    </main>
  );
};

export default ErrorPage;
