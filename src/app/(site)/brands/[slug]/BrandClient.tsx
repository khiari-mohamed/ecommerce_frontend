"use client";
import React, { useState } from "react";
import Image from "next/image";
import BrandProductGrid from "./BrandProductsGrid";
import BrandFiltersClient from '@/components/BrandFiltersClient';

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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pt-[80px] sm:pt-[110px]">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <BrandFiltersClient categories={categories} brands={brands} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:pl-20 lg:ml-8">
          
          {/* Brand Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
              <Image
                src={brand.logo ? `/images/brand/${brand.logo}` : "/images/placeholder.svg"}
                alt={brand.designation_fr}
                width={500}
                height={200}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            <h1 className="mt-4 text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {brand.designation_fr}
            </h1>
          </div>

          {/* Products */}
          <section className="mb-12">
            <BrandProductGrid products={products} />
          </section>

          {/* Tabs */}
          <section className="mb-12">
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              <button
                className={`px-4 py-2 font-medium transition ${
                  activeTab === 'description'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>

              <button
                className={`px-4 py-2 font-medium transition ${
                  activeTab === 'more'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('more')}
              >
                Plus de détails
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed">
                {brand.description_fr ? (
                  <div dangerouslySetInnerHTML={{ __html: brand.description_fr }} />
                ) : (
                  <span className="text-gray-500">Aucune description disponible.</span>
                )}
              </div>
            )}

            {activeTab === 'more' && (
              <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed">
                {brand.more_details ? (
                  <div dangerouslySetInnerHTML={{ __html: brand.more_details }} />
                ) : (
                  <span className="text-gray-500">Aucun détail supplémentaire.</span>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default BrandClient;
