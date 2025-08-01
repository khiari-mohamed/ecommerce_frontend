"use client";
import React, { useEffect, useState } from "react";
import { fetchAllPacks } from "@/services/pack";
import { Pack } from "@/types/pack";
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-2xl">🎁</span>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#8b5cf6' }}>
            Nos Packs Exclusifs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Profitez de nos packs exclusifs pour faire des économies sur vos achats !
          </p>
        </div>
        {/* Packs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {packs.map((pack, idx) => {
            const prixNum = Number(pack.prix) || 0;
            const promoNum = Number(pack.promo) || 0;
            const hasPromo = !!promoNum && promoNum < prixNum;
            return (
              <Card
                key={pack._id}
                className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white"
                style={{
                  border: '1.5px solid #fff',
                  transition: 'border-color 0.3s, border-width 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#a855f7';
                  e.currentTarget.style.borderWidth = '2px';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#fff';
                  e.currentTarget.style.borderWidth = '1.5px';
                }}
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {hasPromo && (
                    <Badge style={{ background: 'linear-gradient(90deg, #a21caf 0%, #8b5cf6 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(139,92,246,0.15)' }} className="text-xs font-bold px-2 py-1">
                      {prixNum > 0 ? `-${Math.round(((prixNum - promoNum) / prixNum) * 100)}%` : ''}
                    </Badge>
                  )}
                  <Badge style={{ background: '#a855f7', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(139,92,246,0.15)' }} className="text-xs font-bold px-2 py-1 mt-1">
                    Pack
                  </Badge>
                </div>
                <CardContent className="flex flex-col h-full p-4">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
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
                  {/* Product Info */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-purple-600 transition-colors duration-300 min-h-[2.5rem] text-center">
                      {pack.designation_fr}
                    </h3>
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4 justify-center">
                      {hasPromo ? (
                        <>
                          <span style={{ background: 'linear-gradient(90deg, #a21caf 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 700, fontSize: '1.25rem' }}>{pack.promo} TND</span>
                          <span className="text-sm text-gray-500 line-through">{pack.prix} TND</span>
                        </>
                      ) : (
                        <span className="text-purple-700 font-bold text-xl mb-4 block text-center">{pack.prix} TND</span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mb-2 text-center">{pack.description_cover}</div>
                  </div>
                  {/* Voir le pack Button */}
                  <Link href={`/shop-details?packId=${pack._id}`} className="w-full mt-auto">
                    <Button className="w-full font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #a21caf 0%, #8b5cf6 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                      Voir le pack
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PacksSection;
