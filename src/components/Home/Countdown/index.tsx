"use client";

import React, { useEffect, useState } from "react";
import BlogItem from "../../Blog/BlogItem";
import { getLandingPageBlogs, getBlogs } from "@/services/blog.service";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const CountdownBlogGrid = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-10 text-center">Blog</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-400">Chargement...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Aucun blog à afficher.</div>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={4}
            navigation
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {blogs.map((blog, key) => (
              <SwiperSlide key={key}>
                <BlogItem blog={blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <style global jsx>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #FF4301;
        }
        .swiper-pagination-bullet-active {
          background: #FF4301;
        }
      `}</style>
    </section>
  );
};

export default CountdownBlogGrid;