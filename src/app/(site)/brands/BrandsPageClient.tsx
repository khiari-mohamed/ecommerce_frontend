"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

export default function BrandsPageClient({ brands }: { brands: any[] }) {
  return (
    <div className="bg-[#f7f7f7] min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto w-full px-4 pb-16 pt-4 md:pt-[100px]">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 tracking-tight uppercase">Toutes les marques</h1>
          <div className="w-24 h-1 bg-[#FF4500] mx-auto mb-10 rounded-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {brands.length === 0 && (
              <div className="col-span-full text-center text-gray-500">Aucune marque trouvée.</div>
            )}
            {brands.map((brand: any, key: number) => (
              <Card
                key={brand._id || brand.slug}
                className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white border-0"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  <Badge style={{ background: '#1cac54', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(28,172,84,0.15)' }} className="text-xs font-bold px-2 py-1">
                    Marque
                  </Badge>
                </div>
                {/* Action buttons */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="flex flex-col h-full p-4">
                  {/* Brand Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={brand.logo ? `/images/brand/${brand.logo}` : "/images/placeholder.svg"}
                      alt={brand.designation_fr}
                      fill
                      className="w-full h-full object-contain p-4"
                      loading="lazy"
                      sizes="100vw"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300" />
                  </div>
                  {/* Brand Info */}
                  <div className="flex-grow flex flex-col">
                    <div className="mb-2 min-h-[1.5rem] max-h-[3rem] flex items-center justify-center px-2">
                      <Link href={`/brands/${brand.slug}`} className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-center leading-tight break-words hyphens-auto w-full" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{brand.designation_fr}</Link>
                    </div>
                    {/* Stars */}
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Image key={i} src="/images/icons/icon-star.svg" alt="star icon" width={12} height={12} loading="lazy" sizes="12px" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({((key + 1) * 13 % 90) + 10})</span>
                    </div>
                    {/* Price placeholder */}
                    <div className="flex flex-col items-center gap-1 mb-3 justify-center">
                      <span className="text-sm sm:text-lg font-bold text-center" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        Voir produits
                      </span>
                    </div>
                  </div>
                  {/* View Products Button */}
                  <Button className="w-full font-medium py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600 }}>
                    <Link href={`/brands/${brand.slug}`} className="flex items-center justify-center w-full">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-white" />
                      <span className="hidden sm:inline">Voir les produits</span>
                      <span className="sm:hidden">Voir</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}