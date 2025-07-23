import { Metadata } from 'next';
import { notFound } from 'next/navigation';
// Update the import path if the file is located elsewhere, for example:
import FAQDetail from '@/components/FAQ/FAQDetail';
// Or ensure that '../components/FAQ/FAQDetail.tsx' exists and is correctly named.
import Breadcrumb from '@/components/Common/Breadcrumb';
import { fetchFaqs, findFaqByCustomId } from '@/services/faq';
import { FAQ } from '@/types/faq';

interface FAQSlugPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all FAQs (optional - for better performance)
export async function generateStaticParams() {
  try {
    const faqs = await fetchFaqs();
    return faqs.map((faq) => ({
      slug: faq.id,
    }));
  } catch (error) {
    console.error('Error generating static params for FAQs:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const faq = await findFaqByCustomId(slug);
    if (!faq) {
      return {
        title: 'FAQ non trouvée',
        description: 'La question demandée n\'existe pas.',
      };
    }
    const cleanAnswer = faq.answer.replace(/<[^>]*>/g, '').substring(0, 160);
    return {
      title: `${faq.question} | FAQ`,
      description: cleanAnswer,
      keywords: `FAQ, ${faq.question}, aide, support`,
      openGraph: {
        title: faq.question,
        description: cleanAnswer,
        type: 'article',
      },
      alternates: {
        canonical: `/faq/${faq.id}`,
      },
    };
  } catch (error) {
    return {
      title: 'FAQ | Erreur',
      description: 'Erreur lors du chargement de la FAQ',
    };
  }
}

export default async function FAQSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let faq: FAQ | null = null;
  let error: string | null = null;

  try {
    faq = await findFaqByCustomId(slug);
    if (!faq) {
      notFound();
    }
  } catch (err) {
    console.error('Error fetching FAQ:', err);
    error = 'Erreur lors du chargement de la FAQ';
  }

  if (error) {
    return (
      <>
        <Breadcrumb title="FAQ" pages={[{ href: '/faq', label: 'FAQ' }]} />
        <section className="py-16 md:py-20 lg:py-28">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <div className="rounded-lg bg-red-50 p-8 dark:bg-red-900/20">
                <h1 className="mb-4 text-2xl font-bold text-red-800 dark:text-red-200">
                  Erreur de chargement
                </h1>
                <p className="text-red-600 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb 
        title={faq!.question} 
        pages={[
          { href: '/faq', label: 'FAQ' }
        ]}
      />
      <FAQDetail faq={faq!} />
    </>
  );
}