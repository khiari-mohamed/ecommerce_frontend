import React from "react";
import MailSuccess from "@/components/MailSuccess";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mail envoyé avec succès | Sobitas",
  description: "Votre message a été envoyé avec succès à l'équipe Sobitas.",
  openGraph: {
    title: "Mail envoyé avec succès | Sobitas",
    description: "Votre message a été envoyé avec succès à l'équipe Sobitas.",
    url: "https://yourdomain.com/mail-success",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
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
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "noindex, nofollow",
  // canonical: "https://yourdomain.com/mail-success", // Uncomment if you want to set canonical
};

const MailSuccessPage = () => {
  return (
    <main>
      <MailSuccess />
    </main>
  );
};

export default MailSuccessPage;
