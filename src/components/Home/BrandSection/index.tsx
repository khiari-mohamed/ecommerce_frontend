"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

const BrandSection: React.FC = () => {
  const router = useRouter();
  const [backendBrands, setBackendBrands] = useState<any[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

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

  // Duplicate brands for seamless infinite scroll
  const brandsToShow = backendBrands.concat(backendBrands);

  return (
    <section className="py-8 sm:py-10 bg-white w-full">
      <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 md:px-8 xl:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Nos Marques</h2>
        <div className="relative overflow-hidden">
          <div
            className="brand-slider flex items-center"
            ref={sliderRef}
          >
            {brandsToShow.map((brand, idx) => (
              <div
                key={brand.id + '-' + idx}
                className="cursor-pointer flex items-center justify-center p-2 sm:p-3 md:p-4 transition hover:scale-105 h-20 sm:h-24 md:h-28 min-w-[150px]"
                onClick={() => router.push(`/brands/${brand.slug}`)}
                title={brand.designation_fr}
              >
                <Image
                  src={
                    brand.logo.startsWith("http")
                      ? brand.logo
                      : `/images/brand/${brand.logo}`
                  }
                  alt={brand.designation_fr}
                  width={140}
                  height={64}
                  className="object-contain w-full h-full max-h-16 sm:max-h-20 md:max-h-24"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .brand-slider {
          animation: scrollBrands 5s linear infinite;
        }
        @keyframes scrollBrands {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .brand-slider:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
export default BrandSection;
