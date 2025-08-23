"use client";
import React, { useState } from "react";
import Image from "next/image";
import parse from 'html-react-parser';
import SubcategoryProductGrid from "@/components/SubcategoryProductGrid";
import BrandFiltersClient from '@/components/BrandFiltersClient';

interface SubcategoryClientProps {
  subcategory: any;
  products: any[];
  categories: any[];
  brands?: any[];
}

const SubcategoryClient: React.FC<SubcategoryClientProps> = ({ subcategory, products, categories = [], brands = [] }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'more'>('description');

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pt-[80px] sm:pt-[110px]">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <BrandFiltersClient categories={categories} brands={brands} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:pl-20 lg:ml-8">
          
          {/* Subcategory Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
              <Image
                src={subcategory.cover || "/images/categories/ELpgM0ANXWjBWHGnKaTO.png"}
                alt={subcategory.name || subcategory.designation_fr || subcategory.designation || "Subcategory"}
                width={500}
                height={200}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            <h1 className="mt-4 text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {subcategory.name || subcategory.designation_fr || subcategory.designation}
            </h1>
          </div>

          {/* Products */}
          <section className="mb-12">
            <SubcategoryProductGrid products={products} />
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

              {subcategory.nutrition_values && (
                <button
                  className={`px-4 py-2 font-medium transition ${
                    activeTab === 'nutrition'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                  onClick={() => setActiveTab('nutrition')}
                >
                  Valeurs Nutritionnelles
                </button>
              )}

              {subcategory.more_details && (
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
              )}
            </div>

            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed">
                {subcategory.description_fr ? (
                  <div>{parse(subcategory.description_fr)}</div>
                ) : (
                  <span className="text-gray-500">Aucune description disponible.</span>
                )}
              </div>
            )}

            {activeTab === 'nutrition' && subcategory.nutrition_values && (
              <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed">
                <div>{parse(subcategory.nutrition_values)}</div>
              </div>
            )}

            {activeTab === 'more' && subcategory.more_details && (
              <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed">
                <div>{parse(subcategory.more_details)}</div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default SubcategoryClient;