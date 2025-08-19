// src/app/sitemap.xml/route.ts
import { getProductListPage } from '@/services/products';
import { getCategories } from '@/services/categories';
import { getAllSubCategories } from '@/services/subcategories';
import { getAllBrands } from '@/services/brand';
import { getBlogs } from '@/services/blog.service';
import { fetchFaqs } from '@/services/faq';
import { fetchMusculationProducts } from '@/services/Musculationproducts'; // Ajout de l'import

const URL = "https://www.protein.tn";

// Fonction pour formater la date de dernière modification au format YYYY-MM-DD
const formatDate = (dateString?: string | Date) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  return new Date(dateString).toISOString().split('T')[0];
};

function generateSiteMap(products: any[], musculationProducts: any[], categories: any[], subcategories: any[], brands: any[], blogs: any[], faqs: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Pages Statiques Principales -->
     <url><loc>${URL}/</loc><priority>1.0</priority><changefreq>daily</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/products</loc><priority>0.9</priority><changefreq>weekly</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/promotions</loc><priority>0.9</priority><changefreq>daily</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/packs</loc><priority>0.9</priority><changefreq>weekly</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/brands</loc><priority>0.9</priority><changefreq>weekly</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/musculation-products</loc><priority>0.9</priority><changefreq>weekly</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/blogs/blog-grid</loc><priority>0.8</priority><changefreq>weekly</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/contact</loc><priority>0.7</priority><changefreq>yearly</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/faq</loc><priority>0.7</priority><changefreq>monthly</changefreq><lastmod>${formatDate()}</lastmod></url>
     
     <!-- Pages Statiques du Footer -->
     <url><loc>${URL}/pages/conditions-generale-de-ventes-protein.tn</loc><priority>0.3</priority><changefreq>yearly</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/pages/qui-sommes-nous</loc><priority>0.6</priority><changefreq>yearly</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/pages/politique-des-cookies</loc><priority>0.3</priority><changefreq>yearly</changefreq><lastmod>${formatDate()}</lastmod></url>
     <url><loc>${URL}/pages/politique-de-remboursement</loc><priority>0.3</priority><changefreq>yearly</changefreq><lastmod>${formatDate()}</lastmod></url>
     
     <!-- Pages de Produits (générées dynamiquement) -->
     ${products.map(p => `
       <url>
           <loc>${`${URL}/produits/${p.slug}`}</loc>
           <lastmod>${formatDate(p.updatedAt || p.created_at)}</lastmod>
           <priority>0.8</priority>
           <changefreq>monthly</changefreq>
       </url>
     `).join('')}

     <!-- MODIFIÉ : Ajout des produits de musculation -->
     ${musculationProducts.map(p => `
       <url>
           <loc>${`${URL}/musculation-products/${p.slug}`}</loc>
           <lastmod>${formatDate(p.updatedAt || p.created_at)}</lastmod>
           <priority>0.8</priority>
           <changefreq>monthly</changefreq>
       </url>
     `).join('')}

     <!-- Pages de Catégories (générées dynamiquement) -->
     ${categories.map(c => `
       <url>
           <loc>${`${URL}/categories/${c.slug}`}</loc>
           <lastmod>${formatDate(c.updatedAt || c.created_at)}</lastmod>
           <priority>0.85</priority>
           <changefreq>weekly</changefreq>
       </url>
     `).join('')}

     <!-- Pages de Sous-Catégories (générées dynamiquement) -->
     ${subcategories.map(s => `
       <url>
           <loc>${`${URL}/subcategories/${s.slug}`}</loc>
           <lastmod>${formatDate(s.updatedAt || s.created_at)}</lastmod>
           <priority>0.8</priority>
           <changefreq>weekly</changefreq>
       </url>
     `).join('')}

     <!-- Pages de Marques (générées dynamiquement) -->
     ${brands.map(b => `
       <url>
           <loc>${`${URL}/brands/${b.slug}`}</loc>
           <lastmod>${formatDate(b.updated_at || b.created_at)}</lastmod>
           <priority>0.7</priority>
           <changefreq>monthly</changefreq>
       </url>
     `).join('')}

     <!-- Pages de Blog (générées dynamiquement) -->
     ${blogs.map(b => `
       <url>
           <loc>${`${URL}/blogs/${b.slug}`}</loc>
           <lastmod>${formatDate(b.updatedAt || b.created_at)}</lastmod>
           <priority>0.7</priority>
           <changefreq>yearly</changefreq>
       </url>
     `).join('')}
     
     <!-- Pages de FAQ (générées dynamiquement) -->
     ${faqs.map(f => `
       <url>
           <loc>${`${URL}/faq/${f.id}`}</loc>
           <lastmod>${formatDate(f.updated_at || f.created_at)}</lastmod>
           <priority>0.6</priority>
           <changefreq>yearly</changefreq>
       </url>
     `).join('')}
   </urlset>
 `;
}

export async function GET() {
  try {
    // Récupérer toutes les données avec gestion d'erreur individuelle
    let productsData: { products: any[] } = { products: [] };
    let musculationProducts: any[] = [];
    let categories: any[] = [];
    let subcategories: any[] = [];
    let brands: any[] = [];
    let blogs: any[] = [];
    let faqs: any[] = [];

    try {
      productsData = await getProductListPage("limit=10000");
    } catch (error) {
      console.warn('Error fetching product list:', error);
    }

    try {
      musculationProducts = await fetchMusculationProducts();
    } catch (error) {
      console.warn('Error fetching musculation products:', error);
    }

    try {
      categories = await getCategories();
    } catch (error) {
      console.warn('Error fetching categories:', error);
    }

    try {
      subcategories = await getAllSubCategories();
    } catch (error) {
      console.warn('Error fetching subcategories:', error);
    }

    try {
      brands = await getAllBrands();
    } catch (error) {
      console.warn('Error fetching brands:', error);
    }

    try {
      blogs = await getBlogs();
    } catch (error) {
      console.warn('Error fetching blogs:', error);
    }

    try {
      faqs = await fetchFaqs();
    } catch (error) {
      console.warn('Error fetching FAQs:', error);
    }

    const sitemap = generateSiteMap(
      productsData.products || [], 
      musculationProducts || [], // Ajout au sitemap
      categories || [], 
      subcategories || [], 
      brands || [], 
      blogs || [], 
      faqs || []
    );

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap:", error);
    return new Response("Erreur lors de la génération du sitemap.", { status: 500 });
  }
}