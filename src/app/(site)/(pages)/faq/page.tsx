import { Metadata } from 'next';
import FAQSection from '@/components/FAQ';
import Breadcrumb from '@/components/Common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Questions Fréquemment Posées | FAQ Sobitas',
  description: 'Trouvez les réponses à vos questions fréquentes sur nos produits et services Sobitas.',
  keywords: 'FAQ, questions fréquentes, aide, support client, Sobitas',
  openGraph: {
    title: 'FAQ | Sobitas',
    description: 'Découvrez toutes les réponses aux questions fréquentes sur Sobitas.',
    url: 'https://protein.tn/faq',
    siteName: 'Sobitas',
    images: [
      {
        url: 'https://protein.tn/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sobitas - FAQ',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | Sobitas',
    description: 'Découvrez toutes les réponses aux questions fréquentes sur Sobitas.',
    images: ['https://protein.tn/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://protein.tn/faq',
  },
};

export default function FAQPage() {
  return (
    <div className="faq-page">
      <Breadcrumb title="FAQ" pages={[]} />
      <FAQSection />
    </div>
  );
}
