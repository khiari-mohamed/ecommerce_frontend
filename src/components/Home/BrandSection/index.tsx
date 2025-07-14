"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { brands } from "./brandData";
import axios from "@/lib/axios";
// SwiperJS imports (install: npm i swiper)
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Navigation, Autoplay } from "swiper/modules";

const BrandSection: React.FC = () => {
  const router = useRouter();
  const [backendBrands, setBackendBrands] = useState<any[]>([]);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await axios.get("/brands");
        setBackendBrands(res.data || []);
      } catch {
        setBackendBrands([]);
      }
    }
    fetchBrands();
  }, []);

  // Helper to get backend slug by static brand id
  const getBackendSlug = (staticBrand: any) => {
    const found = backendBrands.find(
      (b) => b.id === staticBrand.id || b.designation_fr?.toLowerCase() === staticBrand.name?.toLowerCase()
    );
    return found ? found.slug : staticBrand.slug;
  };

  const handleBrandClick = (staticBrand: any) => {
    const backendSlug = getBackendSlug(staticBrand);
    router.push(`/brands/${backendSlug}`);
  };

  // Custom mobile nav handlers
  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };
  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <section className="py-8 sm:py-10 bg-white w-full">
      <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 md:px-8 xl:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Nos Marques</h2>
        <div className="relative">
          <Swiper
            slidesPerView={2}
            spaceBetween={8}
            freeMode={true}
            navigation={true}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            modules={[FreeMode, Navigation, Autoplay]}
            className="brand-swiper"
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 8 },
              320: { slidesPerView: 2.2, spaceBetween: 8 },
              375: { slidesPerView: 2.5, spaceBetween: 8 },
              425: { slidesPerView: 3, spaceBetween: 10 },
              480: { slidesPerView: 3.2, spaceBetween: 10 },
              640: { slidesPerView: 4, spaceBetween: 12 },
              768: { slidesPerView: 5, spaceBetween: 14 },
              1024: { slidesPerView: 6, spaceBetween: 16 },
              1280: { slidesPerView: 7, spaceBetween: 18 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <div
                  className="cursor-pointer flex items-center justify-center p-2 sm:p-3 md:p-4 transition hover:scale-105 h-16 sm:h-20 md:h-24"
                  onClick={() => handleBrandClick(brand)}
                  title={brand.name}
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={100}
                    height={48}
                    className="object-contain w-full h-full max-h-12 sm:max-h-16 md:max-h-20"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom mobile nav */}
          <div className="flex justify-center gap-4 mt-4 sm:hidden">
            <button
              aria-label="Previous"
              onClick={handlePrev}
              className="w-10 h-4 flex items-center justify-center rounded-full bg-gray-300 hover:bg-[#FF4301] transition-colors duration-200"
            >
              <span className="sr-only">Previous</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              aria-label="Next"
              onClick={handleNext}
              className="w-10 h-4 flex items-center justify-center rounded-full bg-gray-300 hover:bg-[#FF4301] transition-colors duration-200"
            >
              <span className="sr-only">Next</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <style global jsx>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #FF4301;
        }
        /* Hide arrows on mobile */
        @media (max-width: 639px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
export default BrandSection;
