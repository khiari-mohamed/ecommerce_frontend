"use client";
import React, { useState } from "react";
import Image from "next/image";
import BrandProductGrid from "./BrandProductsGrid";
import BrandFiltersClient from '@/components/BrandFiltersClient';
import { useSearchParams } from 'next/navigation';

interface Brand {
  _id: string;
  id: string;
  slug: string;
  designation_fr: string;
  logo: string;
  description_fr?: string;
  more_details?: string;
}

interface BrandClientProps {
  brand: Brand;
  products: any[];
  categories: any[];
  brands?: any[];
}

const BrandClient: React.FC<BrandClientProps> = ({ brand, products, categories = [], brands = [] }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'more'>('description');

  return (
    <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-4 sm:py-8 pt-[70px] sm:pt-[100px] md:pt-[120px] lg:pt-[130px]">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Filters (mobile and desktop) - using the same as subcategory page */}
        <BrandFiltersClient categories={categories} brands={brands} />
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Image */}
          <div className="relative w-full h-40 xs:h-48 sm:h-64 md:h-80 mb-4 sm:mb-6 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
            <Image
              src={brand.logo ? `/images/brand/${brand.logo}` : "/images/placeholder.svg"}
              alt={brand.designation_fr}
              width={1200}
              height={400}
              className="w-full h-full object-contain"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            />
          </div>
          {/* Brand Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center break-words text-gray-900">
            {brand.designation_fr}
          </h1>
          {/* Product Grid */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Produits</h2>
            <BrandProductGrid products={products} />
          </div>
          {/* Tabs */}
          <div className="mb-8 sm:mb-10">
            <div className="border-b border-gray-200 mb-3 sm:mb-4 flex gap-2">
              <button
                className={`px-4 sm:px-6 py-2 font-semibold text-gray-700 bg-white rounded-t focus:outline-none ${activeTab === 'description' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              </div>
              {activeTab === 'description' && (
              <div className="prose max-w-none mx-auto text-sm sm:text-base leading-relaxed sm:leading-normal">
              {brand.description_fr ? (
              <div dangerouslySetInnerHTML={{ __html: brand.description_fr }} />
              ) : (
              <span className="text-gray-500">Aucune description disponible.</span>
              )}
              </div>
              )}
              </div>
        </main>
      </div>
    </div>
  );
};

export default BrandClient;
