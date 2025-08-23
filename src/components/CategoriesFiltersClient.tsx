"use client";
import SidebarBrandDropdown from '@/components/SidebarBrandDropdown';
import SidebarKeywords from '@/components/SidebarKeywords';
import { useState } from 'react';

// Helper to check if a category or subcategory is populated
function isPopulatedSubCategory(cat: any) {
  return cat && (cat._id || cat.id) && (cat.slug || cat.name || cat.designation_fr);
}

export default function CategoriesFiltersClient({
  categories,
  subcategories,
  brands,
  selectedBrand,
  selectedKeywords,
  onBrandChange,
  onKeywordsChange,
}: {
  categories: any[];
  subcategories: any[];
  brands: any[];
  selectedBrand: string;
  selectedKeywords: string[];
  onBrandChange: (brandId: string) => void;
  onKeywordsChange: (keywords: string[]) => void;
}) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      {/* Mobile filter button and inline filter content */}
      <div className="block lg:hidden w-full mb-4 flex flex-col items-center">
        <button
          className="bg-[#FF4301] text-white rounded-md px-6 py-2 text-sm sm:text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF4301]/50 mb-2"
          onClick={() => setShowSidebar((v) => !v)}
        >
          Filtrer
        </button>
        {showSidebar && (
          <div className="w-full max-w-[98vw] sm:max-w-sm mx-1 bg-white rounded-none shadow-lg p-2 sm:p-4 animate-slideInUp border border-[#FF4301]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Filtrer</h2>
              <button
                className="ml-auto text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
                onClick={() => setShowSidebar(false)}
                aria-label="Fermer"
                type="button"
              >
                ×
              </button>
            </div>
            {/* Categories (always open) */}
            <div className="mb-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm">Catégories</h3>
              <ul className="space-y-1">
                {categories && categories.map(cat => (
                  isPopulatedSubCategory(cat) ? (
                    <li key={cat._id || cat.id}>
                      <a href={`/categories/${cat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium text-xs sm:text-base">
                        {cat.designation_fr || cat.name}
                      </a>
                    </li>
                  ) : null
                ))}
              </ul>
            </div>
            {/* Subcategories (always open) */}
            <div className="mb-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm">Sous-catégories</h3>
              <ul className="space-y-1">
                {subcategories && subcategories.map(subcat => (
                  isPopulatedSubCategory(subcat) ? (
                    <li key={subcat._id || subcat.id}>
                      <a href={`/subcategories/${subcat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700 text-xs sm:text-base">
                        {subcat.designation_fr || subcat.name}
                      </a>
                    </li>
                  ) : null
                ))}
              </ul>
            </div>
            <SidebarBrandDropdown brands={brands} value={selectedBrand} onChange={onBrandChange} />
            <SidebarKeywords value={selectedKeywords} onChange={onKeywordsChange} />
          </div>
        )}
      </div>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 bg-white rounded-lg shadow-md p-4 xl:p-6 mb-8 lg:mb-0 mt-8">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Filtrer</h2>
        <div className="mb-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Catégories</h3>
          <ul className="space-y-1">
            {categories && categories.map(cat => (
              isPopulatedSubCategory(cat) ? (
                <li key={cat._id || cat.id}>
                  <a href={`/categories/${cat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium">
                    {cat.designation_fr || cat.name}
                  </a>
                </li>
              ) : null
            ))}
          </ul>
        </div>
        <div className="mb-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Sous-catégories</h3>
          <ul className="space-y-1">
            {subcategories && subcategories.map(subcat => (
              isPopulatedSubCategory(subcat) ? (
                <li key={subcat._id || subcat.id}>
                  <a href={`/subcategories/${subcat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700">
                    {subcat.designation_fr || subcat.name}
                  </a>
                </li>
              ) : null
            ))}
          </ul>
        </div>
        <SidebarBrandDropdown brands={brands} value={selectedBrand} onChange={onBrandChange} />
        <SidebarKeywords value={selectedKeywords} onChange={onKeywordsChange} />
      </div>
    </>
  );
}