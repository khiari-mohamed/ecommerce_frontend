import { getProductListPage } from '@/services/products';
import { getCategories } from '@/services/categories';
import { getAllSubCategories } from '@/services/subcategories';
import { getAllBrands } from '@/services/brand';
import { getBlogs } from '@/services/blog.service';
import { fetchFaqs } from '@/services/faq';
import { fetchMusculationProducts } from '@/services/Musculationproducts';

export default async function sitemap() {
  const baseUrl = 'https://www.protein.tn';

  // Récupération des données avec gestion d'erreur
  let products: any[] = [];
  let musculationProducts: any[] = [];
  let categories: any[] = [];
  let subcategories: any[] = [];
  let brands: any[] = [];
  let blogs: any[] = [];
  let faqs: any[] = [];

  try {
    const { products: fetchedProducts } = await getProductListPage("limit=10000");
    products = fetchedProducts || [];
  } catch (error) {
    console.warn('Failed to fetch products for sitemap:', error);
  }

  try {
    musculationProducts = await fetchMusculationProducts() || [];
  } catch (error) {
    console.warn('Failed to fetch musculation products for sitemap:', error);
  }

  try {
    categories = await getCategories() || [];
  } catch (error) {
    console.warn('Failed to fetch categories for sitemap:', error);
  }

  try {
    subcategories = await getAllSubCategories() || [];
  } catch (error) {
    console.warn('Failed to fetch subcategories for sitemap:', error);
  }

  try {
    brands = await getAllBrands() || [];
  } catch (error) {
    console.warn('Failed to fetch brands for sitemap:', error);
  }

  try {
    blogs = await getBlogs() || [];
  } catch (error) {
    console.warn('Failed to fetch blogs for sitemap:', error);
  }

  try {
    faqs = await fetchFaqs() || [];
  } catch (error) {
    console.warn('Failed to fetch faqs for sitemap:', error);
  }

  // Pages statiques
  const staticPages = [
    '',
    '/promotions',
    '/packs',
    '/brands',
    '/musculation-products',
    '/products',
    '/blogs/blog-grid',
    '/faq',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Pages de produits
  const productPages = (products || []).map((product) => ({
    url: `${baseUrl}/produits/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Pages de produits de musculation
  const musculationProductPages = (musculationProducts || []).map((product) => ({
    url: `${baseUrl}/musculation-products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Pages de catégories
  const categoryPages = (categories || []).map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Pages de sous-catégories
  const subcategoryPages = (subcategories || []).map((subcategory) => ({
    url: `${baseUrl}/subcategories/${subcategory.slug}`,
    lastModified: subcategory.updatedAt ? new Date(subcategory.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Pages de marques
  const brandPages = (brands || []).map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: brand.updated_at ? new Date(brand.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Pages de blogs
  const blogPages = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  // Pages de FAQ
  const faqPages = (faqs || []).map((faq) => ({
    url: `${baseUrl}/faq/${faq.id}`,
    lastModified: faq.updated_at ? new Date(faq.updated_at) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...musculationProductPages,
    ...categoryPages,
    ...subcategoryPages,
    ...brandPages,
    ...blogPages,
    ...faqPages,
  ];
}