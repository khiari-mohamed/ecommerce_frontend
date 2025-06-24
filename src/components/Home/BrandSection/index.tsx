"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { brands } from "./brandData";

// SwiperJS imports (install: npm i swiper)
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Navigation, Autoplay } from "swiper/modules";

const BrandSection: React.FC = () => {
  const router = useRouter();

  const handleBrandClick = (brandId: string) => {
    router.push(`/products?brand=${brandId}`);
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Nos Marques</h2>
        <Swiper
          slidesPerView={6}
          spaceBetween={24}
          freeMode={true}
          navigation={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          modules={[FreeMode, Navigation, Autoplay]}
          className="brand-swiper"
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 6 },
          }}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.slug}>
              <div
                className="cursor-pointer flex items-center justify-center p-4 transition hover:scale-105"
                onClick={() => handleBrandClick(brand.id)}
                title={brand.name}
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="h-16 object-contain grayscale hover:grayscale-0 transition"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BrandSection;