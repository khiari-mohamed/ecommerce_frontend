"use client";
import React, { useEffect, useState } from "react";
import { fetchAllPacks } from "@/services/pack";
import { Pack } from "@/types/pack";
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

  if (loading) return <div>Chargement des packs...</div>;
  if (!packs.length) return <div>Aucun pack trouvé.</div>;

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
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: '#FF4500' }}>
          Nos Packs Exclusifs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-10">
          {packs.map((pack, idx) => (
            <div key={pack._id} className="bg-white rounded-xl shadow-xl flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl duration-300 w-full h-full">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl mb-4 bg-gray-100">
                <Image
                  src={getImageSrc(pack, idx)}
                  alt={pack.alt_cover || pack.designation_fr || `Pack ${idx + 1}`}
                  fill
                  className="object-cover"
                  priority={idx < 4}
                  loading={idx < 4 ? 'eager' : 'lazy'}
                  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 25vw, 340px"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImages[idx % fallbackImages.length];
                    target.onerror = null;
                  }}
                />
              </div>
              <div className="p-4 w-full flex flex-col items-center">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-center">{pack.designation_fr}</h3>
                <div className="text-primary text-base sm:text-xl font-semibold mb-1">
                  {pack.promo ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">{pack.prix} TND</span>
                      <span className="text-red-500">{pack.promo} TND</span>
                    </>
                  ) : (
                    <span>{pack.prix} TND</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mb-2 text-center">{pack.description_cover}</div>
                <a
                  href={`/shop-details?packId=${pack._id}`}
                  className="mt-auto px-4 py-2 sm:px-5 sm:py-2 bg-[#FF4301] text-white rounded-full shadow hover:scale-105 transition font-semibold w-full text-center"
                >
                  Voir le pack
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PacksSection;