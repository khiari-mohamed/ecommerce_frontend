"use client";
import { useTestimonials } from '../../../services/useTestimonials';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const { testimonials, loading } = useTestimonials();

  // Deduplicate testimonials by review + authorName without changing type or logic
  const filteredTestimonials = (() => {
    const seen = new Set<string>();
    return testimonials.filter(item => {
      const review = item.review?.trim();
      const name = item.authorName?.trim().toLowerCase();
      const key = `${name}-${review}`;
      if (!review || review.length < 4 || !name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  // Render stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4`}
        style={i < rating ? { color: '#FFD600', fill: '#FFD600' } : { color: '#D1D5DB', fill: '#D1D5DB' }}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'rgb(255, 69, 0)' }}>
            💬 Avis de nos clients
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que pensent nos clients de PROTEINE TUNISIE.
            Plus de 15 ans d'expérience au service de votre performance.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {renderStars(5)}
            </div>
            <span className="text-lg font-semibold text-gray-800">4.9/5</span>
            <span className="text-gray-600">(680 avis)</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.slice(0, 6).map((review, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col h-full"
                style={{ borderWidth: '1px', borderColor: '#e5e7eb' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#ffecd4' }}
                    >
                      <span style={{ color: '#FF8000', fontWeight: 'bold' }}>
                        {review.authorName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{review.authorName}</h4>
                      {review.authorRole && isNaN(Number(review.authorRole)) && (
                        <p className="text-sm text-gray-500">{review.authorRole}</p>
                      )}
                    </div>
                  </div>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-semibold text-green-800"
                    style={{ backgroundColor: '#e0fce4' }}
                  >
                    Vérifié
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(Number(review.stars) || 5)}
                </div>
                <div className="relative flex-grow">
                  <Quote 
                  className="h-6 w-6 absolute -top-2 -left-1 text-yellow-400"
                  style={{ color: '#FFD600' }}
                  />
                  <p className="text-gray-700 leading-relaxed pl-4">
                    {review.review}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
            Voir tous les avis
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;