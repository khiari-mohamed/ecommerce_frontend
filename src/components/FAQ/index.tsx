'use client';
import { useState, useEffect } from 'react';
import { FAQ } from '@/types/faq';
import { fetchFaqs, searchFaqs } from '@/services/faq';
import FAQItem from './FAQItem';


const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setLoading(true);
        const data = await fetchFaqs();
        setFaqs(data);
        setFilteredFaqs(data);
      } catch (err) {
        setError('Erreur lors du chargement des FAQ');
        console.error('Error loading FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFaqs();
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredFaqs(faqs);
      return;
    }
    try {
      const results = await searchFaqs(term);
      setFilteredFaqs(results);
    } catch (err) {
      // fallback client-side
      const filtered = faqs.filter(faq =>
        faq.question.toLowerCase().includes(term.toLowerCase()) ||
        faq.answer.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-lg bg-red-50 p-8 dark:bg-red-900/20">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">Erreur de chargement</h3>
              <p className="text-red-600 dark:text-red-300">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="faq-black">
      {/* Embedded Google Map Section with credentials, reviews, and stars */}
      <div className="w-full md:w-[92%] mx-auto mt-20">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between px-4 pt-4 pb-2 bg-white rounded-t-xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="font-bold text-lg !text-black">PROTEINE TUNISIE – SOBITAS</div>
            <div className="text-sm !text-black">Av. 14 Janvier, Sousse, Tunisie</div>
          </div>
          <div className="flex items-center gap-3 mt-2 md:mt-0">
            <div className="flex items-center">
              {/* 5 yellow stars, 4.8/5 */}
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            </div>
            <span className="ml-2 font-semibold text-base !text-black">5</span>
            <span className="text-xs !text-black">(681 avis)</span>
          </div>
        </div>
        <div className="h-[260px] w-full bg-white flex items-center justify-center shadow-md rounded-b-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3074.4748320799786!2d10.630564999999997!3d35.836349299999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302131b30e891b1%3A0x51dae0f25849b20c!2sPROTEINE%20TUNISIE%20%E2%80%93%20SOBITAS%20%7C%20Creatine%2C%20Mat%C3%A9riel%20de%20Musculation%20%26%20Whey%20%C3%A0%20Sousse!5e1!3m2!1sfr!2sus!4v1752469342748!5m2!1sfr!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 260 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Notre emplacement"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* FAQ Two-Column Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-2 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start w-full">
            {/* Left: Title & Subtitle */}
            <div className="md:pl-4 lg:pl-8 flex flex-col justify-start">
              <h1 className="text-4xl md:text-5xl font-extrabold !text-black mb-5 leading-tight break-words">
                Questions Fréquemment<br />Posées
              </h1>
              <p className="text-lg md:text-xl !text-black mb-8 max-w-md">
                Trouvez rapidement les réponses à vos questions les plus courantes sur nos produits et services
              </p>
            </div>
            {/* Right: FAQ List */}
            <div className="md:pr-4 lg:pr-8">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="mb-1 text-base font-semibold !text-black">
                    {searchTerm ? 'Aucun résultat trouvé' : 'Aucune FAQ disponible'}
                  </h3>
                  <p className="text-xs !text-black">
                    {searchTerm
                      ? 'Essayez avec des mots-clés différents ou consultez toutes nos FAQ.'
                      : 'Les questions fréquemment posées seront bientôt disponibles.'
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => handleSearch('')}
                      className="mt-2 text-primary hover:underline text-xs"
                    >
                      Voir toutes les FAQ
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {filteredFaqs
                    .slice() // make a copy to avoid mutating state
                    .sort((a, b) => Number(a.id) - Number(b.id)) // sort numerically by id
                    .map((faq, index) => (
                      <FAQItem key={faq._id} faq={faq} index={index} openByDefault={index === 0} />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      
      {/* Contact CTA */}
      <section className="pb-16 md:pb-20 lg:pb-28">
        <div className="container">
          <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-8 text-center sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold !text-black sm:text-3xl">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="mx-auto mb-8 max-w-2xl !text-black">
              Notre équipe de support client est disponible pour répondre à toutes vos questions personnalisées
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border-2 border-primary px-8 py-3 text-base font-semibold text-primary transition duration-300 ease-in-out hover:bg-primary hover:text-white"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Nous Contacter
              </a>
              <a
                href="tel:+21673200169"
                className="inline-flex items-center justify-center rounded-full border-2 border-primary px-8 py-3 text-base font-semibold text-primary transition duration-300 ease-in-out hover:bg-primary hover:text-white"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Appeler
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQSection;
