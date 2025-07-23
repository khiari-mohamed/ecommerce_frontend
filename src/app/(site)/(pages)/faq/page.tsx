import { Metadata } from 'next';
import FAQSection from '@/components/FAQ';
import Breadcrumb from '@/components/Common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Questions Fréquemment Posées | FAQ',
  description: 'Trouvez les réponses à vos questions les plus fréquentes sur nos produits et services.',
  keywords: 'FAQ, questions fréquentes, aide, support client',
};

export default function FAQPage() {
  return (
    <div className="faq-page">
      <Breadcrumb title="FAQ" pages={[]} />
      <FAQSection />
    </div>
  );
}