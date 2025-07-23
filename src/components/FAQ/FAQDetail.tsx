'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FAQ } from '@/types/faq';
import { fetchFaqs } from '@/services/faq';

interface FAQDetailProps {
  faq: FAQ;
}

const FAQDetail = ({ faq }: FAQDetailProps) => {
  const [relatedFaqs, setRelatedFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedFaqs = async () => {
      try {
        const allFaqs = await fetchFaqs();
        // Get 3 random FAQs excluding the current one
        const filtered = allFaqs.filter(f => f._id !== faq._id);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRelatedFaqs(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Error loading related FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRelatedFaqs();
  }, [faq._id]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${faq.question} - FAQ`;

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Lien copié dans le presse-papiers !');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      return;
    }
    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <section className="py-16 md:py-20 lg:py-28 !text-black">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* FAQ Header */}
          <div className="mb-12">
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold !text-black">
                {faq.id}
              </div>
              <div className="text-sm !text-black">
                FAQ #{faq.id}
              </div>
            </div>
            <h1 className="mb-6 text-3xl font-bold !text-black sm:text-4xl lg:text-5xl">
              {faq.question}
            </h1>
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm !text-black">
              {faq.created_at && (
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 !text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Publié le {new Date(faq.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              {faq.updated_at && faq.updated_at !== faq.created_at && (
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 !text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Mis à jour le {new Date(faq.updated_at).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          </div>
          {/* FAQ Answer */}
          <div className="mb-12">
            <div className="rounded-2xl border border-stroke bg-white p-8 shadow-sm sm:p-12">
              <div
                className="prose prose-lg max-w-none prose-headings:!text-black prose-p:!text-black prose-strong:!text-black prose-a:!text-black prose-ul:!text-black prose-ol:!text-black"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          </div>
          {/* Share Section */}
          <div className="mb-12">
            <div className="rounded-xl bg-gray-50 p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-semibold !text-black">
                Partager cette FAQ
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center space-x-2 rounded-lg bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center space-x-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center space-x-2 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copier le lien</span>
                </button>
              </div>
            </div>
          </div>
          {/* Related FAQs */}
          <div className="mb-12">
            <h3 className="mb-8 text-2xl font-bold !text-black">
              Questions similaires
            </h3>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-stroke bg-white p-6">
                    <div className="mb-4 h-4 w-8 rounded bg-gray-200"></div>
                    <div className="mb-3 h-6 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            ) : relatedFaqs.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedFaqs.map((relatedFaq) => (
                  <Link
                    key={relatedFaq._id}
                    href={`/faq/${relatedFaq.id}`}
                    className="group rounded-xl border border-stroke bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center space-x-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-base font-bold !text-black">
                        {relatedFaq.id}
                      </span>
                      <span className="text-xs !text-black">
                        FAQ #{relatedFaq.id}
                      </span>
                    </div>
                    <h4 className="mb-2 text-lg font-semibold !text-black group-hover:text-primary transition-colors">
                      {relatedFaq.question}
                    </h4>
                    <div className="text-sm !text-black line-clamp-2">
                      {/* Show a short preview of the answer, strip HTML tags */}
                      {relatedFaq.answer.replace(/<[^>]+>/g, '').slice(0, 80)}...
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center !text-black">
                Aucune question similaire trouvée.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQDetail;
