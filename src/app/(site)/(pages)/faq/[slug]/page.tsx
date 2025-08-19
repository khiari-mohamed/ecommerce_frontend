import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FAQDetail from '@/components/FAQ/FAQDetail';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { fetchFaqs, findFaqByCustomId } from '@/services/faq';
import { FAQ } from '@/types/faq';

interface FAQSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ✅ Génération des slugs statiques (SEO-friendly + perf)
export async function generateStaticParams() {
  try {
    const faqs = await fetchFaqs();
    return (faqs || []).map((faq) => ({
      slug: String(faq.id),
    }));
  } catch (error) {
    console.warn('Error generating static params for FAQs, using empty array:', error);
    return [];
  }
}

// ✅ SEO dynamique
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  try {
    const faq = await findFaqByCustomId(slug);

    if (!faq) {
      return {
        title: 'FAQ non trouvée | Sobitas',
        description: 'La question demandée n’existe pas sur Sobitas.',
        robots: 'noindex, follow',
      };
    }

    // Nettoyer la réponse pour la description SEO (max 160 chars)
    const cleanAnswer = faq.answer.replace(/<[^>]*>/g, '').substring(0, 160);

    return {
      title: `${faq.question} | FAQ Sobitas`,
      description: cleanAnswer,
      keywords: `FAQ, ${faq.question}, aide, support, Sobitas`,
      openGraph: {
        title: faq.question,
        description: cleanAnswer,
        url: `https://protein.tn/faq/${faq.id}`,
        siteName: 'Sobitas',
        images: [
          {
            url: 'https://protein.tn/og-image.jpg',
            width: 1200,
            height: 630,
            alt: `Sobitas - FAQ : ${faq.question}`,
          },
        ],
        locale: 'fr_FR',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: faq.question,
        description: cleanAnswer,
        images: ['https://protein.tn/og-image.jpg'],
      },
      alternates: {
        canonical: `https://protein.tn/faq/${faq.id}`,
      },
    };
  } catch (error) {
    return {
      title: 'FAQ | Erreur',
      description: 'Erreur lors du chargement de la FAQ',
      robots: 'noindex, nofollow',
    };
  }
}

export default async function FAQSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
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
        pages={[{ href: '/faq', label: 'FAQ' }]}
      />
      <FAQDetail faq={faq!} />
    </>
  );
}
