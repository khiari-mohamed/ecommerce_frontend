import Signup from "@/components/Auth/Signup";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un compte | Sobitas",
  description: "Inscrivez-vous sur Sobitas pour profiter de nos offres et gérer vos commandes.",
  openGraph: {
    title: "Créer un compte | Sobitas",
    description: "Inscrivez-vous sur Sobitas pour profiter de nos offres et gérer vos commandes.",
    url: "https://protein.tn/signup",
    siteName: "Sobitas",
    images: [
      {
        url: "https://protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Créer un compte",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Créer un compte | Sobitas",
    description: "Inscrivez-vous sur Sobitas pour profiter de nos offres et gérer vos commandes.",
    images: ["https://protein.tn/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://protein.tn/signup", // Uncomment if you want to set canonical
};

const SignupPage = () => {
  return (
    <main>
      <Signup />
    </main>
  );
};

export default SignupPage;
