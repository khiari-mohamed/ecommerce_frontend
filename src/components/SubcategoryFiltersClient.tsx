"use client";
import SidebarAromeDropdown from '@/components/SidebarAromeDropdown';
import SidebarBrandDropdown from '@/components/SidebarBrandDropdown';
import SidebarKeywords from '@/components/SidebarKeywords';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Helper moved here because you can't pass functions from server to client
function isPopulatedSubCategory(cat: any) {
  return cat && (cat._id || cat.id) && (cat.slug || cat.name || cat.designation_fr);
}

export default function SubcategoryFiltersClient({
  categories,
  brands,
  aromas
}: {
  categories: any[];
  brands: any[];
  aromas: any[];
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBrandId = searchParams?.get('brand') || '';
  const [selectedBrand, setSelectedBrand] = useState(initialBrandId);
  const initialArome = searchParams?.get('arome') || '';
  const [selectedArome, setSelectedArome] = useState(initialArome);
  const initialKeywords = (searchParams?.get('keywords') || '').split(',').filter(Boolean);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialKeywords);

  // Update URL when brand changes
  const handleBrandChange = (brandId: string) => {
  setSelectedBrand(brandId);
  const params = new URLSearchParams(Array.from((searchParams?.entries() ?? [])));
  if (brandId) {
  params.set('brand', brandId);
  params.delete('brand_id'); // Remove old param if present
  } else {
  params.delete('brand');
  params.delete('brand_id');
  }
  router.replace(`?${params.toString()}`);
  };
  
  // Update URL when aroma changes
  const handleAromeChange = (arome: string) => {
  setSelectedArome(arome);
  const params = new URLSearchParams(Array.from((searchParams?.entries() ?? [])));
  if (arome) {
  params.set('arome', arome);
  } else {
  params.delete('arome');
  }
  router.replace(`?${params.toString()}`);
  };

  // Update URL when keywords change
const handleKeywordsChange = (keywords: string[]) => {
  setSelectedKeywords(keywords);
  const params = new URLSearchParams(Array.from((searchParams?.entries() ?? [])));
  if (keywords.length > 0) {
    params.set('keywords', keywords.join(','));
  } else {
    params.delete('keywords');
  }
  router.replace(`?${params.toString()}`);
};

// Close modal on Escape key and prevent background scroll
  useEffect(() => {
    if (!showSidebar) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSidebar(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showSidebar]);

  return (
    <>
      {/* Mobile filter button and modal */}
      <div className="block lg:hidden w-full mb-4 flex justify-center mt-4">
        <button
          className="bg-[#FF4301] text-white rounded-md px-6 py-2 text-sm sm:text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF4301]/50"
          onClick={() => setShowSidebar(true)}
        >
          Filtrer
        </button>
      </div>
      {showSidebar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="w-full max-w-[98vw] sm:max-w-sm mx-1 bg-white rounded-2xl shadow-lg p-2 sm:p-4 animate-slideInUp max-h-[92vh] overflow-y-auto relative mt-24"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-[#FF4301] text-white text-2xl font-bold hover:bg-[#e04a0a] focus:outline-none focus:ring-2 focus:ring-[#FF4301]/50 z-10"
              onClick={() => setShowSidebar(false)}
              aria-label="Fermer"
              type="button"
            >
              ×
            </button>
            <div className="flex justify-between items-center mb-4 pr-10">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Filtrer</h2>
            </div>
            {/* Categories (always open) */}
            <div className="mb-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm">Catégories</h3>
              <ul className="space-y-1">
                {categories.map(cat => (
                  isPopulatedSubCategory(cat) ? (
                    <li key={cat._id}>
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
                {categories.flatMap(cat => isPopulatedSubCategory(cat) && Array.isArray(cat.subCategories) ? cat.subCategories : []).map(subcat => (
                  isPopulatedSubCategory(subcat) ? (
                    <li key={subcat._id}>
                      <a href={`/subcategories/${subcat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700 text-xs sm:text-base">
                        {subcat.designation_fr || subcat.name}
                      </a>
                    </li>
                  ) : null
                ))}
              </ul>
            </div>
            {/* Fabricants (dynamic dropdown, client component) */}
            <SidebarBrandDropdown brands={brands} value={selectedBrand} onChange={handleBrandChange} />
            {/* Arômes (selectable dropdown, dynamic, client component) */}
            <SidebarAromeDropdown aromas={aromas} value={selectedArome} onChange={handleAromeChange} />
            {/* Mots clés (dynamic keywords filter) */}
            <SidebarKeywords value={selectedKeywords} onChange={handleKeywordsChange} />
          </div>
        </div>
      )}
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 bg-white rounded-lg shadow-md p-4 xl:p-6 mb-8 lg:mb-0 mt-8">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Filtrer</h2>
        {/* Categories (always open) */}
        <div className="mb-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Catégories</h3>
          <ul className="space-y-1">
            {categories.map(cat => (
              isPopulatedSubCategory(cat) ? (
                <li key={cat._id}>
                  <a href={`/categories/${cat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium">
                    {cat.designation_fr || cat.name}
                  </a>
                </li>
              ) : null
            ))}
          </ul>
        </div>
        {/* Subcategories (always open) */}
        <div className="mb-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Sous-catégories</h3>
          <ul className="space-y-1">
            {categories.flatMap(cat => isPopulatedSubCategory(cat) && Array.isArray(cat.subCategories) ? cat.subCategories : []).map(subcat => (
              isPopulatedSubCategory(subcat) ? (
                <li key={subcat._id}>
                  <a href={`/subcategories/${subcat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700">
                    {subcat.designation_fr || subcat.name}
                  </a>
                </li>
              ) : null
            ))}
          </ul>
        </div>
        {/* Fabricants (dynamic dropdown, client component) */}
        <SidebarBrandDropdown brands={brands} value={selectedBrand} onChange={handleBrandChange} />
        {/* Arômes (selectable dropdown, dynamic, client component) */}
        <SidebarAromeDropdown aromas={aromas} value={selectedArome} onChange={handleAromeChange} />
        {/* Mots clés (dynamic keywords filter) */}
        <SidebarKeywords value={selectedKeywords} onChange={handleKeywordsChange} />
      </aside>
    </>
  );
}
