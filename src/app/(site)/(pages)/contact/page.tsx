import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Sobitas",
  description: "Contactez l'équipe Sobitas pour toute question, demande ou assistance.",
  openGraph: {
    title: "Contact | Sobitas",
    description: "Contactez l'équipe Sobitas pour toute question, demande ou assistance.",
    url: "https://yourdomain.com/contact",
    siteName: "Sobitas",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobitas - Contact",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Sobitas",
    description: "Contactez l'équipe Sobitas pour toute question, demande ou assistance.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
  robots: "index, follow",
  // canonical: "https://yourdomain.com/contact", // Uncomment if you want to set canonical
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
