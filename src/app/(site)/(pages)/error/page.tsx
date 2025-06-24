import React from "react";
import Error from "@/components/Error";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erreur | Sobitas",
  description: "Une erreur s'est produite sur Sobitas. Veuillez réessayer ou contacter le support.",
  openGraph: {
    title: "Erreur | Sobitas",
    description: "Une erreur s'est produite sur Sobitas. Veuillez réessayer ou contacter le support.",
    url: "https://yourdomain.com/error",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
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
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "noindex, nofollow",
  // canonical: "https://yourdomain.com/error", // Uncomment if you want to set canonical
};

const ErrorPage = () => {
  return (
    <main>
      <Error />
    </main>
  );
};

export default ErrorPage;
