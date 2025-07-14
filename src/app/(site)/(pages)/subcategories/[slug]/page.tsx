import { notFound } from 'next/navigation';
import { SubCategory } from '@/types/subcategory';
import { isPopulatedProduct, isPopulatedSubCategory } from '@/types/category';
import axios from '@/lib/axios';
import parse from 'html-react-parser';
import Image from 'next/image';
import SidebarAromeDropdown from '@/components/SidebarAromeDropdown';
import SidebarBrandDropdown from '@/components/SidebarBrandDropdown';
import SidebarKeywords from "@/components/SidebarKeywords";
import SubcategoryProductCard from "@/components/SubcategoryProductCard";
import SubcategoryFiltersClient from "@/components/SubcategoryFiltersClient";
async function getSubCategoryBySlug(slug: string): Promise<SubCategory | null> {
  try {
    const res = await axios.get(`/sub-categories?slug=${slug}`);
    if (res.data && res.data.data && res.data.data.length > 0) {
      // Filter for the subcategory with the exact slug
      const filtered = res.data.data.find((subcat: SubCategory) => subcat.slug === slug);
      return filtered || null;
    }
    return null;
  } catch (error) {
    return null;
  }
}

import { Metadata } from "next";

export async function generateMetadata({ params }: { params?: { slug: string } }): Promise<Metadata> {
  const slug = params?.slug;
  if (!slug) return {};
  try {
    const res = await axios.get(`/sub-categories?slug=${encodeURIComponent(slug)}`);
    const subcat = res.data?.data?.find((sc: SubCategory) => sc.slug === slug);
    if (!subcat) return {};
    return {
      title: subcat.name || subcat.designation_fr || subcat.designation,
      description: subcat.description_fr,
      openGraph: {
        images: subcat.cover ? [subcat.cover] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function SubcategoryPage({ params }: { params?: { slug: string } }) {
  const slug = params?.slug;
  if (!slug) notFound();
  const subcategory = await getSubCategoryBySlug(slug);
  if (!subcategory) notFound();

  // Fetch categories and subcategories for sidebar (dynamic)
  let categories = [];
  try {
    const res = await axios.get('/categories?populate=subcategories');
    categories = res.data?.data || res.data || [];
  } catch {}

  // Fetch brands server-side
  let brands = [];
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/brands`);
    if (Array.isArray(res.data)) {
      brands = res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      brands = res.data.data;
    }
  } catch {
    brands = [];
  }
  const motsCles = ["Sans sucre", "Vegan", "Protéiné", "Énergie", "Récupération"];

  // Fetch aromas server-side
  let aromas = [];
  try {
    const res = await axios.get('/aromas');
    if (Array.isArray(res.data)) {
      aromas = res.data;
    } else if (res.data && Array.isArray(res.data.aromas)) {
      aromas = res.data.aromas;
    }
  } catch {
    aromas = [];
  }

  // Fetch products for the subcategory dynamically
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  let products = [];
  try {
   const subcatId = subcategory?.id; // Use the string id, not the slug
const res = await axios.get(`${API_URL}/products?sous_categorie_id=${subcatId}`);
products = res.data?.data?.products || [];
  } catch {
    products = [];
  }

  return (
    <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-4 sm:py-8 pt-[70px] sm:pt-[100px] md:pt-[120px] lg:pt-[130px]">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Filters (client component for responsiveness) */}
        <SubcategoryFiltersClient
          categories={categories}
          brands={brands}
          aromas={aromas}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Image */}
          <div className="relative w-full h-40 xs:h-48 sm:h-64 md:h-80 mb-4 sm:mb-6 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
            <Image
              src={subcategory.cover || "/images/categories/ELpgM0ANXWjBWHGnKaTO.png"}
              alt={subcategory.name || subcategory.designation_fr || subcategory.designation || "Subcategory"}
              width={1200}
              height={400}
              className="w-full h-full object-cover"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            />
          </div>
          {/* Subcategory Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center break-words text-gray-900">
            {subcategory.name || subcategory.designation_fr || subcategory.designation}
          </h1>

          {/* Product Grid */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Produits</h2>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {products.map((product, idx) => (
                  <SubcategoryProductCard key={product._id || idx} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucun produit disponible pour cette sous-catégorie.</p>
            )}
          </div>

          {/* Description Tab */}
          <div className="mb-8 sm:mb-10">
            <div className="border-b border-gray-200 mb-3 sm:mb-4">
              <button className="px-4 sm:px-6 py-2 font-semibold text-gray-700 bg-white rounded-t focus:outline-none">Description</button>
            </div>
            <div className="prose max-w-none mx-auto text-sm sm:text-base">
              {subcategory.description_fr ? parse(subcategory.description_fr) : <span className="text-gray-500">Aucune description disponible.</span>}
            </div>
          </div>

          {/* Nutrition Values Tab */}
          {subcategory.nutrition_values && (
            <div className="mb-8 sm:mb-10">
              <div className="border-b border-gray-200 mb-3 sm:mb-4">
                <button className="px-4 sm:px-6 py-2 font-semibold text-gray-700 bg-white rounded-t focus:outline-none">Valeurs Nutritionnelles</button>
              </div>
              <div className="prose max-w-none mx-auto text-sm sm:text-base">
                {parse(subcategory.nutrition_values)}
              </div>
            </div>
          )}

          {/* More Details Tab */}
          {subcategory.more_details && (
            <div className="mb-8 sm:mb-10">
              <div className="border-b border-gray-200 mb-3 sm:mb-4">
                <button className="px-4 sm:px-6 py-2 font-semibold text-gray-700 bg-white rounded-t focus:outline-none">Plus de détails</button>
              </div>
              <div className="prose max-w-none mx-auto text-sm sm:text-base">
                {parse(subcategory.more_details)}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

