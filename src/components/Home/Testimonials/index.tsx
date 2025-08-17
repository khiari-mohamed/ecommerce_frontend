"use client";
import React, { useRef } from 'react';
import { useTestimonialsWithConfig } from '../../../services/useTestimonialsWithConfig';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const Testimonials = () => {
  const { testimonials, config, loading, showSection } = useTestimonialsWithConfig();
  
  // Don't render if section is disabled
  if (!showSection) return null;
  const swiperRef = useRef<any>(null);

  // Handler for custom navigation
  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };
  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  // Get all testimonials up to maxDisplay limit
  const filteredTestimonials = testimonials.slice(0, config.maxDisplay);

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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'rgb(255, 69, 0)' }}>
            💬 {config.sectionTitle}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {config.sectionDescription}
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
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Aucun avis à afficher.</div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={4}
              navigation={{
                nextEl: '.testimonials-swiper-next',
                prevEl: '.testimonials-swiper-prev',
              }}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
              className="pb-12"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {filteredTestimonials.map((review, idx) => (
                <SwiperSlide key={idx}>
                  <div 
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col h-[320px]"
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
                      <p className="text-gray-700 leading-relaxed pl-4 line-clamp-4">
                        {review.review}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom navigation buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                aria-label="Previous"
                onClick={handlePrev}
                className="testimonials-swiper-prev w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 hover:bg-orange-600 transition-colors duration-200"
              >
                <span className="sr-only">Previous</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                aria-label="Next"
                onClick={handleNext}
                className="testimonials-swiper-next w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 hover:bg-orange-600 transition-colors duration-200"
              >
                <span className="sr-only">Next</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
            Voir tous les avis
          </button>
        </div>
      </div>
      <style global jsx>{`
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }
        .swiper-pagination-bullet-active {
          background: #ea580c;
        }
        @media (max-width: 639px) {
          .testimonials-swiper-prev,
          .testimonials-swiper-next {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;