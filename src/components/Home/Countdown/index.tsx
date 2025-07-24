"use client";

import React, { useEffect, useState, useRef } from "react";
import BlogItem from "../../Blog/BlogItem";
import { getLandingPageBlogs, getBlogs } from "@/services/blog.service";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Blog } from "@/types/blog";

const CountdownBlogGrid = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    getLandingPageBlogs().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setBlogs(data);
        setLoading(false);
      } else {
        getBlogs().then((fallback) => {
          setBlogs(Array.isArray(fallback) ? fallback : []);
          setLoading(false);
        });
      }
    });
  }, []);

  // Handler for custom navigation
  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };
  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-10 text-center" style={{ color: '#FF4500' }}>Blog</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Chargement...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Aucun blog à afficher.</div>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={4}
              navigation={{
                nextEl: '.custom-swiper-next',
                prevEl: '.custom-swiper-prev',
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
              {blogs.map((blog, key) => (
                <SwiperSlide key={key}>
                  <BlogItem blog={blog} />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom navigation buttons - shown on both mobile and desktop but styled differently */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                aria-label="Previous"
                onClick={handlePrev}
                className="custom-swiper-prev w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 hover:bg-[#FF4301] transition-colors duration-200"
              >
                <span className="sr-only">Previous</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                aria-label="Next"
                onClick={handleNext}
                className="custom-swiper-next w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 hover:bg-[#FF4301] transition-colors duration-200"
              >
                <span className="sr-only">Next</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <style global jsx>{`
        /* Hide default navigation arrows */
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }
        .swiper-pagination-bullet-active {
          background: #FF4301;
        }
        /* Adjust custom button size for mobile */
        @media (max-width: 639px) {
          .custom-swiper-prev,
          .custom-swiper-next {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CountdownBlogGrid;