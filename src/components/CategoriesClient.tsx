"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';
import SidebarBrandDropdown from '@/components/SidebarBrandDropdown';
import SidebarAromeDropdown from '@/components/SidebarAromeDropdown';
import SidebarKeywords from '@/components/SidebarKeywords';
import SubcategoryProductCard from '@/components/SubcategoryProductCard';
import { useRouter, useSearchParams } from 'next/navigation';

function normalizeImageUrl(url?: string): string {
  if (!url || url.startsWith("undefined") || url === "/default-cover.jpg") {
    return "/images/categories/ELpgM0ANXWjBWHGnKaTO.png";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!url.startsWith("/")) return "/" + url;
  return url;
}

interface CategoriesClientProps {
  category: any;
  subcategories: any[];
  products: any[];
  categories: any[];
  brands: any[];
  keywordsData: any[];
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({
  category,
  subcategories,
  products: initialProducts,
  categories,
  brands,
  keywordsData
}) => {
  // Filters state from URL
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBrandId = searchParams?.get('brand') || '';
  const [selectedBrand, setSelectedBrand] = useState(initialBrandId);
  const initialKeywords = (searchParams?.get('keywords') || '').split(',').filter(Boolean);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialKeywords);
  const [showSidebar, setShowSidebar] = useState(false);

  // Filtering logic (client-side for keywords)
  let filteredProducts = initialProducts;
  if (selectedBrand) {
    filteredProducts = filteredProducts.filter(
      (product: any) =>
        String(product.brand_id) === String(selectedBrand) ||
        String(product.brand) === String(selectedBrand)
    );
  }
  if (selectedKeywords.length > 0 && keywordsData.length > 0) {
    const allowedProductIds = new Set(
      keywordsData
        .filter((kw: any) => selectedKeywords.includes(kw.keyword))
        .flatMap((kw: any) => kw.product_ids)
    );
    filteredProducts = filteredProducts.filter((product: any) => allowedProductIds.has(String(product.id)));
  }

  // Update URL when filters change
  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    const params = new URLSearchParams(Array.from((searchParams?.entries() ?? [])));
    if (brandId) {
      params.set('brand', brandId);
      params.delete('brand_id');
    } else {
      params.delete('brand');
      params.delete('brand_id');
    }
    router.replace(`?${params.toString()}`);
  };
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

  return (
    <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-4 sm:py-8 pt-[70px] sm:pt-[100px] md:pt-[120px] lg:pt-[130px]">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Filters (client component for responsiveness) */}
        {/* Mobile filter button and inline filter content */}
        <div className="block lg:hidden w-full mb-4 flex flex-col items-center">
          <button
            className="bg-[#FF4301] text-white rounded-md px-8 py-3 text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF4301]/50 mb-2"
            onClick={() => setShowSidebar((v) => !v)}
          >
            Filtrer
          </button>
          {showSidebar && (
            <div className="w-full max-w-[95vw] sm:max-w-sm mx-2 bg-white rounded-none shadow-lg p-3 sm:p-6 animate-slideInUp border border-[#FF4301]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Filtrer</h2>
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
                <h3 className="font-semibold text-gray-700 mb-2">Catégories</h3>
                <ul className="space-y-1">
                  {categories.map(cat => (
                    cat && (cat._id || cat.id) && (cat.slug || cat.name || cat.designation_fr) ? (
                      <li key={cat._id || cat.id}>
                        <a href={`/categories/${cat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700 font-medium text-base">
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
                  {subcategories.map(subcat => (
                    subcat && (subcat._id || subcat.id) && (subcat.slug || subcat.name || subcat.designation_fr) ? (
                      <li key={subcat._id || subcat.id}>
                        <a href={`/subcategories/${subcat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700 text-base">
                          {subcat.designation_fr || subcat.name}
                        </a>
                      </li>
                    ) : null
                  ))}
                </ul>
              </div>
              <SidebarBrandDropdown brands={brands} value={selectedBrand} onChange={handleBrandChange} />
              <SidebarKeywords value={selectedKeywords} onChange={handleKeywordsChange} />
            </div>
          )}
        </div>
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 bg-white rounded-lg shadow-md p-4 xl:p-6 mb-8 lg:mb-0">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Filtrer</h2>
          <div className="mb-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Catégories</h3>
            <ul className="space-y-1">
              {categories.map(cat => (
                cat && (cat._id || cat.id) && (cat.slug || cat.name || cat.designation_fr) ? (
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
              {subcategories.map(subcat => (
                subcat && (subcat._id || subcat.id) && (subcat.slug || subcat.name || subcat.designation_fr) ? (
                  <li key={subcat._id || subcat.id}>
                    <a href={`/subcategories/${subcat.slug}`} className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700">
                      {subcat.designation_fr || subcat.name}
                    </a>
                  </li>
                ) : null
              ))}
            </ul>
          </div>
          <SidebarBrandDropdown brands={brands} value={selectedBrand} onChange={handleBrandChange} />
          <SidebarKeywords value={selectedKeywords} onChange={handleKeywordsChange} />
        </aside>
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Image */}
          <div className="relative w-full h-40 xs:h-48 sm:h-64 md:h-80 mb-4 sm:mb-6 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
            <Image
              src={normalizeImageUrl(category.cover)}
              alt={category.designation_fr || category.designation || 'Category'}
              width={1200}
              height={400}
              className="w-full h-full object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              priority
            />
          </div>
          {/* Category Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center break-words text-gray-900">
            {category.designation_fr || category.designation}
          </h1>
          {/* Product Grid */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Produits</h2>
            {filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {filteredProducts.map((product, idx) => {
                  const name =
                    product.designation_fr ||
                    product.designation ||
                    product.name ||
                    "Produit";
                  return (
                    <SubcategoryProductCard
                      key={product._id || product.id || idx}
                      product={{
                        ...product,
                        designation_fr: name,
                        designation: name,
                        name,
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">Aucun produit disponible pour cette catégorie.</p>
            )}
          </div>
          {/* Description Tab */}
          <div className="mb-8 sm:mb-10">
            <div className="border-b border-gray-200 mb-3 sm:mb-4">
              <button className="px-4 sm:px-6 py-2 font-semibold text-gray-700 bg-white rounded-t focus:outline-none">
                Description
              </button>
            </div>
            <div
              className="
                prose
                max-w-none
                mx-auto
                text-sm
                sm:text-base
                leading-relaxed
                sm:leading-normal
                break-words
                whitespace-pre-line
                prose-p:my-2
                prose-h1:my-4
                prose-h2:my-3
                prose-h3:my-2
                prose-ul:pl-5
                prose-ol:pl-5
                prose-li:my-1
                prose-strong:font-semibold
                prose-img:max-w-full
                prose-img:h-auto
                prose-table:text-xs
                sm:prose-table:text-base
              "
            >
              {category.description_fr
                ? parse(category.description_fr)
                : <span className="text-gray-500">Aucune description disponible.</span>}
            </div>
          </div>
          {/* Nutrition Values Tab */}
          {category.nutrition_values && (
            <div className="mb-8 sm:mb-10">
              <div className="border-b border-gray-200 mb-3 sm:mb-4">
                <button className="px-4 sm:px-6 py-2 font-semibold text-gray-700 bg-white rounded-t focus:outline-none">
                  Valeurs Nutritionnelles
                </button>
              </div>
              <div
                className="
                  prose
                  max-w-none
                  mx-auto
                  text-sm
                  sm:text-base
                  leading-relaxed
                  sm:leading-normal
                  break-words
                  whitespace-pre-line
                  prose-p:my-2
                  prose-h1:my-4
                  prose-h2:my-3
                  prose-h3:my-2
                  prose-ul:pl-5
                  prose-ol:pl-5
                  prose-li:my-1
                  prose-strong:font-semibold
                  prose-img:max-w-full
                  prose-img:h-auto
                  prose-table:text-xs
                  sm:prose-table:text-base
                "
              >
                {parse(category.nutrition_values)}
              </div>
            </div>
          )}
          {/* More Details Tab */}
          {category.more_details && (
            <div className="mb-8 sm:mb-10">
              <div className="border-b border-gray-200 mb-3 sm:mb-4">
                <button className="px-4 sm:px-6 py-2 font-semibold text-gray-700 bg-white rounded-t focus:outline-none">
                  Plus de détails
                </button>
              </div>
              <div
                className="
                  prose
                  max-w-none
                  mx-auto
                  text-sm
                  sm:text-base
                  leading-relaxed
                  sm:leading-normal
                  break-words
                  whitespace-pre-line
                  prose-p:my-2
                  prose-h1:my-4
                  prose-h2:my-3
                  prose-h3:my-2
                  prose-ul:pl-5
                  prose-ol:pl-5
                  prose-li:my-1
                  prose-strong:font-semibold
                  prose-img:max-w-full
                  prose-img:h-auto
                  prose-table:text-xs
                  sm:prose-table:text-base
                "
              >
                {parse(category.more_details)}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoriesClient;
