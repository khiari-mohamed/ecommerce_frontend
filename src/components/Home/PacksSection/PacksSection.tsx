"use client";
import React, { useEffect, useState } from "react";
import { fetchAllPacks } from "@/services/pack";
import { Pack } from "@/types/pack";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Image from 'next/image';

const fallbackImages = [
  "/images/packs/pack.webp",
  "/images/packs/pack2.webp",
  "/images/packs/pack3.webp",
  "/images/packs/pack4.webp",
];

const PacksSection: React.FC = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPacks = async () => {
      try {
        const data = await fetchAllPacks();
        setPacks(data);
      } catch (e) {
        console.error("Failed to fetch packs:", e);
        setPacks([]);
      } finally {
        setLoading(false);
      }
    };
    getPacks();
  }, []);

  if (loading) return <div>Loading packs...</div>;
  if (!packs.length) return <div>No packs found.</div>;

  const getImageSrc = (pack: Pack, index: number) => {
    if (!pack.cover || pack.cover === "undefined") {
      return fallbackImages[index % fallbackImages.length];
    }
    if (pack.cover.startsWith('http') || pack.cover.startsWith('/')) {
      return pack.cover;
    }
    return `/storage/app/public/${pack.cover}`;
  };

  return (
    <section className="packs-section my-12">
      <div className="container">
        <h2 className="text-3xl font-extrabold mb-8 text-center gradient-text">Nos Packs Exclusifs</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {packs.map((pack, idx) => (
            <SwiperSlide key={pack._id}>
              <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl duration-300">
                <div className="w-44 h-44 relative mb-4 overflow-hidden rounded-lg border-4 border-orange-100 bg-gray-100">
                  <Image
                    src={getImageSrc(pack, idx)}
                    alt={pack.alt_cover || pack.designation_fr || `Pack ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx < 4}
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImages[idx % fallbackImages.length];
                      target.onerror = null;
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{pack.designation_fr}</h3>
                <div className="text-primary text-xl font-semibold mb-1">
                  {pack.promo ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">{pack.prix} TND</span>
                      <span className="text-red-500">{pack.promo} TND</span>
                    </>
                  ) : (
                    <span>{pack.prix} TND</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-2 text-center">{pack.description_cover}</div>
                <a
                  href={`/shop-details?packId=${pack._id}`}
                  className="mt-auto px-5 py-2 bg-[#FF4301] text-white rounded-full shadow hover:scale-105 transition font-semibold"
                >
                  Voir le pack
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(90deg, #ff8a00, #e52e71);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
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

export default PacksSection;