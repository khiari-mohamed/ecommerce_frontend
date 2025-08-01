"use client";
import React, { useEffect, useState, useRef } from "react";
import BlogItem from "../../Blog/BlogItem";
import { getLandingPageBlogs, getBlogs } from "@/services/blog.service";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Blog } from "@/types/blog";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

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
    <section className="py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#FF4500' }}>
            Blog & FAQ
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Découvrez nos conseils d'experts et trouvez les réponses à vos questions sur la nutrition sportive
          </p>
        </div>
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
              {blogs.map((blog, key) => {
                // BlogItem logic for image, date, etc.
                let imageUrl = "";
                if (blog.cover) {
                  if (typeof blog.cover === "string") {
                    const cleanCover = blog.cover.replace(/^\/\/+/, "");
                    imageUrl = blog.cover.startsWith("http")
                      ? blog.cover
                      : "/uploads/" + cleanCover;
                  } else if ((blog.cover as any).url) {
                    const cleanCoverUrl = (blog.cover as any).url.replace(/^\/\/+/, "");
                    imageUrl = (blog.cover as any).url.startsWith("http")
                      ? (blog.cover as any).url
                      : "/uploads/" + cleanCoverUrl;
                  }
                }
                if (!imageUrl) imageUrl = "/images/blog/blog-01.jpg";
                const date = blog.created_at
                  ? new Date(blog.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" })
                  : blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" })
                  : "No date";
                const views = (blog as any).views ?? 0;
                const title = blog.designation_fr || blog.title || "";
                const imageAlt = blog.alt_cover || title || "blog";
                const description = blog.description_cover || blog.meta_description_fr || blog.meta || "";
                return (
                  <SwiperSlide key={key}>
                    <div className="group bg-white rounded-xl px-5 pt-5 pb-4 mt-3 flex flex-col h-full min-h-[310px] max-h-[340px] w-full transition-all duration-500 border border-white hover:border-[#FF4500] hover:shadow-2xl hover:-translate-y-2" style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)' }}>
                      <Link href={`/blogs/${blog.slug}`} className="rounded-md overflow-hidden block mb-4">
                        <img
                          src={imageUrl}
                          alt={imageAlt}
                          title={description}
                          className="rounded-md w-full h-48 object-cover"
                          width={330}
                          height={210}
                        />
                      </Link>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                          {date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-orange-500" />
                          {(blog as any).readTime || "-"}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 text-lg leading-tight group-hover:text-[#FF4500] transition-colors duration-300 min-h-[2.7em]">
                        {title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                        {description}
                      </p>
                      <Link href={`/blogs/${blog.slug}`} className="w-full mt-auto">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:text-[#FF4500] h-10 px-4 w-full text-orange-600 border-white hover:border-[#FF4500] font-medium py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg">
                          Voir plus
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            {/* Custom navigation buttons */}
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
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }
        .swiper-pagination-bullet-active {
          background: #FF4301;
        }
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
