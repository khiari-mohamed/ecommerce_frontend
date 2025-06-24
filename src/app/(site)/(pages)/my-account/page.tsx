import MyAccount from "@/components/MyAccount";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Compte | Sobitas",
  description: "Gérez vos informations personnelles, commandes et préférences sur votre compte Sobitas.",
  openGraph: {
    title: "Mon Compte | Sobitas",
    description: "Gérez vos informations personnelles, commandes et préférences sur votre compte Sobitas.",
    url: "https://yourdomain.com/my-account",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Mon Compte",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Compte | Sobitas",
    description: "Gérez vos informations personnelles, commandes et préférences sur votre compte Sobitas.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/my-account", // Uncomment if you want to set canonical
};

const MyAccountPage = () => {
  return (
    <main>
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;
