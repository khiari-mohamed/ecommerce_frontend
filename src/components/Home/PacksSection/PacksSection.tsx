"use client";
import React, { useEffect, useState } from "react";
import { usePacksWithConfig } from '../../../services/usePacksWithConfig';
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
  const { packs, config, loading, showSection } = usePacksWithConfig();
  
  if (!showSection) return null;

  if (loading) return <div>Chargement des packs...</div>;
  if (!packs.length) return null;

  const getImageSrc = (pack: Pack, index: number) => {
    // Check mainImage first (from backend schema)
    if (pack.mainImage?.url) {
      return pack.mainImage.url;
    }
    
    // Check cover field
    if (pack.cover && pack.cover !== "undefined") {
      if (pack.cover.startsWith('http') || pack.cover.startsWith('/')) {
        return pack.cover;
      }
      return `/storage/app/public/${pack.cover}`;
    }
    
    // Fallback to default images
    return fallbackImages[index % fallbackImages.length];
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-yellow-50" aria-labelledby="packs-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-6 shadow-lg">
            <span className="text-2xl">🎁</span>
          </div>
          <h2 id="packs-title" className="text-4xl font-bold mb-4" style={{ color: 'rgb(255, 69, 0)' }}>
            {config.sectionTitle}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {config.sectionDescription}
          </p>
        </div>
        {/* Packs grid */}
        <div className={`grid gap-8 ${
          packs.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          packs.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
          packs.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {packs.map((pack, idx) => {
            const prixNum = Number(pack.prix || pack.price) || 0;
            const promoNum = Number(pack.promo || pack.oldPrice) || 0;
            const hasPromo = !!promoNum && promoNum < prixNum;
            return (
              <Card
                key={pack._id}
                className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white border-0 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 rounded-lg"
                role="article"
                aria-label={`Pack: ${pack.designation_fr || pack.designation || 'Pack sans nom'}`}
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {hasPromo && (
                    <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }} className="text-xs font-bold px-2 py-1">
                      {prixNum > 0 ? `-${Math.round(((prixNum - promoNum) / prixNum) * 100)}%` : ''}
                    </Badge>
                  )}
                  <Badge style={{ background: '#1cac54', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(28,172,84,0.15)' }} className="text-xs font-bold px-2 py-1 mt-1">
                    Pack
                  </Badge>
                </div>
                <CardContent className="flex flex-col h-full p-4">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    <Link 
                      href={`/shop/${pack.slug}`}
                      className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
                      aria-label={`Voir les détails du ${pack.designation_fr || pack.designation || 'pack'}`}
                    >
                      <Image
                        src={getImageSrc(pack, idx)}
                        alt={`Image du ${pack.designation_fr || pack.designation || 'pack'}`}
                        fill
                        className="w-full h-full object-contain"
                        priority={idx < 4}
                        loading={idx < 4 ? 'eager' : 'lazy'}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = fallbackImages[idx % fallbackImages.length];
                          target.onerror = null;
                        }}
                      />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300" />
                  </div>
                  {/* Product Info */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
                      <Link 
                        href={`/shop/${pack.slug}`}
                        className="focus:outline-none focus:underline focus:text-orange-600"
                        aria-label={`Voir les détails du ${pack.designation_fr || pack.designation || 'pack'}`}
                      >
                        {pack.designation_fr || pack.designation || 'Pack sans nom'}
                      </Link>
                    </h3>
                    {/* Reviews */}
                    <div className="flex flex-row flex-nowrap items-center justify-center gap-2 mb-2" role="group" aria-label="Évaluation du pack">
                      <div className="flex flex-row flex-nowrap items-center gap-1">
                        <div className="flex" role="img" aria-label="5 étoiles sur 5">
                          {[...Array(5)].map((_, i) => (
                            <Image key={i} src="/images/icons/icon-star.svg" alt="" width={14} height={14} loading="lazy" sizes="14px" aria-hidden="true" />
                          ))}
                        </div>
                        <span className="text-custom-sm ml-1" aria-label={`${((idx + 1) * 17 % 90) + 10} avis`}>
                          ({((idx + 1) * 17 % 90) + 10})
                        </span>
                      </div>
                    </div>
                    {/* Price */}
                    <div className="flex flex-col items-center gap-1 mb-3 justify-center" role="group" aria-label="Prix du pack">
                      <span 
                        className="text-sm sm:text-lg font-bold text-center" 
                        style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}
                        aria-label={`Prix actuel: ${Number(pack.promo || pack.oldPrice || pack.prix || pack.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`}
                      >
                        {Number(pack.promo || pack.oldPrice || pack.prix || pack.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                      </span>
                      {hasPromo && (
                        <span 
                          className="text-xs sm:text-sm text-gray-500 line-through text-center"
                          aria-label={`Prix original: ${Number(pack.prix || pack.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`}
                        >
                          {Number(pack.prix || pack.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Voir le pack Button */}
                  <Link href={`/shop/${pack.slug}`} className="w-full mt-auto">
                    <Button 
                      className="w-full font-medium py-3 rounded-lg shadow-lg hover:shadow-xl focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center" 
                      style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }}
                      aria-label={`Voir les détails du ${pack.designation_fr || pack.designation || 'pack'}`}
                    >
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
