import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/services/categories';
import { getAllSubCategories } from '@/services/subcategories';
import { getProductListPage } from '@/services/products';
import CategoriesClient from '@/components/CategoriesClient';
import React from 'react';

// Accept params as Promise<any> to match the broken .next/types
export async function generateMetadata({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return {
    title: `Catégorie: ${resolvedParams.slug}`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    if (!slug) {
      notFound();
      return null;
    }
    const category = await getCategoryBySlug(slug);

    if (!category) {
      notFound();
      return null;
    }

    const allSubcategories = await getAllSubCategories();
    const subcategories = allSubcategories.filter(
      (subcat) => String(subcat.categorie_id) === String(category.id)
    );

    // Fetch all categories (with subcategories) for sidebar navigation
    let categories = [];
    try {
      const res = await (await import('@/lib/axios')).default.get('/categories?populate=subcategories');
      categories = res.data?.data || res.data || [];
    } catch {}

    // Fetch brands
    let brands: any[] = [];
    try {
      const res = await (await import('@/lib/axios')).default.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/brands`);
      if (Array.isArray(res.data)) {
        brands = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        brands = res.data.data;
      }
    } catch {}

    // Fetch keywords
    let keywordsData = [];
    try {
      const keywordsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/keywords`, { cache: 'no-store' });
      keywordsData = await keywordsRes.json();
    } catch {}

    const { products: allProducts } = await getProductListPage("limit=1000");
    const subcategoryIds = subcategories.map(sub => String(sub.id));
    
    // Prefer category.products if populated, else filter allProducts or fetch with brand filter
    let products: any[] = [];
    const { isPopulatedProduct } = await import('@/types/category');
    // Extract brandId from resolvedParams (URL query)
    let brandId = '';
    if (typeof resolvedParams === 'object' && resolvedParams.brand) {
      brandId = resolvedParams.brand;
    }
    if (Array.isArray(category.products) && category.products.length > 0 && isPopulatedProduct(category.products[0])) {
      products = (category.products as any[]).filter(isPopulatedProduct);
    } else if (brandId) {
      const axios = (await import('@/lib/axios')).default;
      let url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/products?sous_categorie_id=${subcategoryIds.join(',')}&brand=${brandId}`;
      console.log('API URL:', url);
      const res = await axios.get(url);
      console.log('API Response:', res.data);
      products = res.data?.data?.products || [];
    } else {
      products = allProducts.filter(prod =>
        prod.sous_categorie_id && subcategoryIds.includes(String(prod.sous_categorie_id))
      );
    }
    // Normalize product names: use title as fallback for name
    products = products.map(prod => ({
      ...prod,
      designation_fr: prod.designation_fr || prod.designation || prod.title || prod.name,
      designation: prod.designation || prod.title || prod.name || prod.designation_fr,
      name: prod.name || prod.title || prod.designation || prod.designation_fr
    }));

    return (
      <CategoriesClient
        category={category}
        subcategories={subcategories}
        products={products}
        categories={categories}
        brands={brands}
        keywordsData={keywordsData}
      />
    );
  } catch (err) {
    console.error('Category page error:', err);
    notFound();
    return null;
  }
}