"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';
import CategoriesFiltersClient from '@/components/CategoriesFiltersClient';
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

// Helper to check if a category or subcategory is populated
function isPopulatedSubCategory(cat: any) {
  return cat && (cat._id || cat.id) && (cat.slug || cat.name || cat.designation_fr);
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
    <div className="max-w-[1400px] mx-auto px-1 sm:px-6 lg:px-8 py-6 sm:py-10 pt-[80px] sm:pt-[110px]">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <CategoriesFiltersClient categories={categories} subcategories={subcategories} brands={brands} selectedBrand={selectedBrand} selectedKeywords={selectedKeywords} onBrandChange={handleBrandChange} onKeywordsChange={handleKeywordsChange} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:pl-20 lg:ml-8">
          
          {/* Category Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
              <Image
                src={normalizeImageUrl(category.cover)}
                alt={category.designation_fr || category.designation || 'Category'}
                width={500}
                height={200}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            <h1 className="mt-4 text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {category.designation_fr || category.designation}
            </h1>
          </div>

          {/* Products */}
          <section className="mb-12">
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
          </section>

          {/* Tabs */}
          <section className="mb-12">
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              <button className="px-4 py-2 font-medium border-b-2 border-blue-600 text-blue-600">
                Description
              </button>
              {category.nutrition_values && (
                <button className="px-4 py-2 font-medium text-gray-600 hover:text-blue-500">
                  Valeurs Nutritionnelles
                </button>
              )}
              {category.more_details && (
                <button className="px-4 py-2 font-medium text-gray-600 hover:text-blue-500">
                  Plus de détails
                </button>
              )}
            </div>

            <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed">
              {category.description_fr ? (
                <div>{parse(category.description_fr)}</div>
              ) : (
                <span className="text-gray-500">Aucune description disponible.</span>
              )}
            </div>

            {category.nutrition_values && (
              <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed mt-8">
                <h3 className="text-lg font-semibold mb-4">Valeurs Nutritionnelles</h3>
                <div>{parse(category.nutrition_values)}</div>
              </div>
            )}

            {category.more_details && (
              <div className="prose max-w-none text-gray-700 text-sm sm:text-base leading-relaxed mt-8">
                <h3 className="text-lg font-semibold mb-4">Plus de détails</h3>
                <div>{parse(category.more_details)}</div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default CategoriesClient;