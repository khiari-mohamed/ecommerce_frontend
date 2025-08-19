"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function BrandsPageClient({ brands }: { brands: any[] }) {
  return (
    <div className="bg-[#f7f7f7] min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto w-full px-4 pb-16 pt-0 md:pt-[100px]">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 tracking-tight uppercase">Toutes les marques</h1>
          <div className="w-24 h-1 bg-[#FF4500] mx-auto mb-10 rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.length === 0 && (
              <div className="col-span-full text-center text-gray-500">Aucune marque trouvée.</div>
            )}
            {brands.map((brand: any) => (
              <Link
                key={brand._id || brand.slug}
                href={`/brands/${brand.slug}`}
                className="group flex flex-col items-center justify-center bg-white shadow border border-[#ececec] hover:border-[#FF4500] hover:shadow-lg transition-all duration-200 aspect-square min-h-[260px] h-full w-full cursor-pointer p-6"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex-1 flex items-center justify-center w-full h-full">
                  <Image
                    src={brand.logo ? `/images/brand/${brand.logo}` : "/images/placeholder.svg"}
                    alt={brand.designation_fr}
                    width={220}
                    height={220}
                    className="object-contain w-[80%] h-[80%] max-w-[180px] max-h-[180px] group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 text-base font-bold text-[#222] group-hover:text-[#FF4500] truncate w-full uppercase tracking-wide text-center">
                  {brand.designation_fr}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}