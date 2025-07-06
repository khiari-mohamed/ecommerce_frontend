"use client";
import React, { useEffect, useState } from "react";
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

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Nos Marques</h2>
        <Swiper
          slidesPerView={2}
          spaceBetween={12}
          freeMode={true}
          navigation={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          modules={[FreeMode, Navigation, Autoplay]}
          className="brand-swiper"
          breakpoints={{
            0: { slidesPerView: 2 },
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.id}>
              <div
                className="cursor-pointer flex items-center justify-center p-2 sm:p-4 transition hover:scale-105"
                onClick={() => handleBrandClick(brand)}
                title={brand.name}
              >
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={120}
                  height={64}
                  className="h-10 sm:h-16 object-contain grayscale hover:grayscale-0 transition"
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