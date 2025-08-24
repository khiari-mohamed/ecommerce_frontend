"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { getEnhancedBrandImageSrc, shouldUnoptimizeNonProductImage } from "@/utils/nonProductImage";

const BrandSection: React.FC = () => {
  const router = useRouter();
  const [backendBrands, setBackendBrands] = useState<any[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await axios.get("/brands");
        console.log('Brands API response:', res.data);
        setBackendBrands(res.data || []);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
        setBackendBrands([]);
      }
    }
    fetchBrands();
  }, []);

  // Generate slug for brands that don't have one and filter valid brands
  const processedBrands = backendBrands.map(brand => {
    if (!brand) return null;
    
    // Generate slug if missing
    if (!brand.slug) {
      const name = brand.designation_fr || brand.designation || brand.name || '';
      brand.slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim() || brand.id || brand._id; // Fallback to ID if name is empty
    }
    
    return brand;
  }).filter(brand => 
    brand && (brand.designation_fr || brand.designation || brand.name)
  );
  
  const brandsToShow = processedBrands.concat(processedBrands);

  return (
    <section className="py-8 sm:py-10 bg-white w-full">
      <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 md:px-8 xl:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center" style={{ color: "#FF4500" }}>Nos Marques</h2>
        <div className="relative overflow-hidden">
          <div
            className="brand-slider flex items-center"
            ref={sliderRef}
          >
            {brandsToShow.map((brand, idx) => (
              <div
                key={(brand.id || brand._id || idx) + '-' + idx}
                className="cursor-pointer flex items-center justify-center p-2 sm:p-3 md:p-4 transition hover:scale-105 h-20 sm:h-24 md:h-28 min-w-[150px]"
                onClick={() => {
                  if (brand.slug) {
                    router.push(`/brands/${brand.slug}`);
                  }
                }}
                title={brand.designation_fr || brand.designation || brand.name}
              >
                <Image
                  src={getEnhancedBrandImageSrc(brand)}
                  alt={brand.designation_fr || brand.designation || brand.name}
                  width={140}
                  height={64}
                  className="object-contain w-full h-full max-h-16 sm:max-h-20 md:max-h-24"
                  loading="lazy"
                  unoptimized={shouldUnoptimizeNonProductImage(brand.logo)}
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
