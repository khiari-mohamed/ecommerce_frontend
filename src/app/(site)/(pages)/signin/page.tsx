import Signin from "@/components/Auth/Signin";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | Sobitas",
  description: "Connectez-vous à votre compte Sobitas pour accéder à vos commandes et informations personnelles.",
  openGraph: {
    title: "Connexion | Sobitas",
    description: "Connectez-vous à votre compte Sobitas pour accéder à vos commandes et informations personnelles.",
    url: "https://protein.tn/signin",
    siteName: "Sobitas",
    images: [
      {
        url: "https://protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Connexion",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connexion | Sobitas",
    description: "Connectez-vous à votre compte Sobitas pour accéder à vos commandes et informations personnelles.",
    images: ["https://protein.tn/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://protein.tn/signin", // Uncomment if you want to set canonical
};

const SigninPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default SigninPage;
