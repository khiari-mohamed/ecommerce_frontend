import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Protein.tn – Magasin Musculation à Sousse & Service Client",
  description: "Contactez-nous par téléphone, email ou visitez notre magasin à Sousse pour conseils et achats de compléments alimentaires et matériel de musculation.",
  keywords: ["contact protein.tn", "magasin musculation Sousse", "service client protéines", "numéro téléphone Protein.tn", "adresse magasin compléments Tunisie"],
  openGraph: {
    title: "Contact Protein.tn – Magasin Musculation à Sousse & Service Client",
    description: "Contactez-nous par téléphone, email ou visitez notre magasin à Sousse pour conseils et achats de compléments alimentaires et matériel de musculation.",
    url: "https://www.protein.tn/contact",
    siteName: "Sobitas - Protein.tn",
    images: [
      {
        url: "https://www.protein.tn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contactez Protein.tn",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contactez-nous | Protein.tn",
    description: "Contactez l'équipe de Protein.tn pour toute question ou assistance.",
    images: ["https://www.protein.tn/og-image.jpg"],
  },
  robots: "index, follow",
  alternates: {
    canonical: "/contact",
  },
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;