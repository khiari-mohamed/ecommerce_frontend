import ClientLayout from "./ClientLayout";
import { Metadata } from "next";
import Script from 'next/script'; // N'oubliez pas cet import en haut de votre fichier

// Métadonnées optimisées pour le SEO de protein.tn
export const metadata: Metadata = {
  // --- Métadonnées de base ---
  metadataBase: new URL("https://www.protein.tn"),
  title: {
    default: 'Compléments Alimentaires Tunisie – Whey, Créatine & Musculation | Protein.tn',
    template: '%s | Protein.tn',
  },
  description: "Achetez vos compléments alimentaires 100% authentiques en Tunisie : whey, créatine, BCAA, vitamines et matériel de musculation. Livraison express et paiement à la livraison partout en Tunisie.",
  keywords: ['compléments alimentaires Tunisie', 'whey protéine Tunisie', 'créatine Tunisie', 'matériel musculation Tunisie', 'nutrition sportive Tunisie', 'BCAA Tunisie', 'vitamines sportives Tunisie'],
  
  // --- Open Graph (pour Facebook, LinkedIn, etc.) ---
  openGraph: {
    title: 'Compléments Alimentaires Tunisie – Whey, Créatine & Musculation | Protein.tn',
    description: 'Achetez vos compléments alimentaires 100% authentiques en Tunisie : whey, créatine, BCAA, vitamines et matériel de musculation. Livraison express et paiement à la livraison partout en Tunisie.',
    url: "https://www.protein.tn",
    siteName: 'Sobitas - Protein.tn',
    images: [
      {
        url: '/og-image.jpg', // Assurez-vous que cette image existe dans /public
        width: 1200,
        height: 630,
        alt: 'Sobitas - Protein.tn',
      },
    ],
    locale: 'fr_TN',
    type: 'website',
  },

  // --- Twitter Card ---
  twitter: {
    card: 'summary_large_image',
    title: 'Compléments Alimentaires Tunisie – Whey, Créatine & Musculation | Protein.tn',
    description: 'Achetez vos compléments alimentaires 100% authentiques en Tunisie : whey, créatine, BCAA, vitamines et matériel de musculation. Livraison express et paiement à la livraison partout en Tunisie.',
    images: ['/og-image.jpg'], // Doit être une URL relative
  },

  // --- Robots et Indexation ---
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // --- Favicons pour tous les appareils ---
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // --- URL Canonique ---
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="fr" suppressHydrationWarning={true}>
      <head>
        {/* Le <head> reste vide, Next.js gère les scripts placés dans <body> */}
      </head>
      <body>
        {/* --- Google Analytics (gtag.js) optimisé pour Next.js --- */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-config" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* --- Données Structurées JSON-LD pour l'Organisation (Votre code original) --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Sobitas - Protein.tn",
              "url": "https://www.protein.tn",
              "logo": "https://www.protein.tn/images/logo/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+216-73-200-169",
                "contactType": "Service Client"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rue Ribat",
                "addressLocality": "Sousse",
                "postalCode": "4000",
                "addressCountry": "TN"
              },
              "sameAs": [
                "https://www.facebook.com/sobitass/",
                "https://x.com/TunisieProteine",
                "https://www.youtube.com/@sobitas6850",
                "https://www.tiktok.com/@sobitassousse",
                "https://www.instagram.com/sobitass/"
              ]
            })
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}