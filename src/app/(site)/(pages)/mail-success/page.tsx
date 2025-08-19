import React from "react";
import MailSuccess from "@/components/MailSuccess";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mail envoyé avec succès | Sobitas",
  description: "Votre message a été envoyé avec succès à l'équipe Sobitas.",
  openGraph: {
    title: "Mail envoyé avec succès | Sobitas",
    description: "Votre message a été envoyé avec succès à l'équipe Sobitas.",
    url: "https://protein.tn/mail-success",
    siteName: "Sobitas",
    images: [
      {
        url: "https://protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Mail envoyé avec succès",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mail envoyé avec succès | Sobitas",
    description: "Votre message a été envoyé avec succès à l'équipe Sobitas.",
    images: ["https://protein.tn/og-image.jpg"],
  },
  robots: "noindex, nofollow",
  // canonical: "https://protein.tn/mail-success", // inutile pour ce type de page
};

const MailSuccessPage = () => {
  return (
    <main>
      <MailSuccess />
    </main>
  );
};

export default MailSuccessPage;
