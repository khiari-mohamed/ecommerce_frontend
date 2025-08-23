import { notFound } from 'next/navigation';
import { SubCategory } from '@/types/subcategory';
import { getSubCategoryBySlug } from '@/services/subcategories';
import axios from '@/lib/axios';
import { Metadata } from "next";
import SubcategoryClient from "./SubcategoryClient";

export async function generateMetadata({ params }: { params: Promise<any> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  if (!slug) {
    return {
      title: "Sous-catégorie non trouvée | Protein.tn",
      description: "La sous-catégorie recherchée n'existe pas ou n'est plus disponible."
    };
  }
  try {
    const subcat = await getSubCategoryBySlug(slug);
    if (!subcat) {
      return {
        title: "Sous-catégorie non trouvée | Protein.tn",
        description: "La sous-catégorie recherchée n'existe pas ou n'est plus disponible."
      };
    }
    
    const subcategoryName = subcat.name || subcat.designation_fr || subcat.designation || "Sous-catégorie";
    const title = `${subcategoryName} - Compléments Alimentaires | Protein.tn`;
    const description = subcat.description_fr 
      ? subcat.description_fr.replace(/<[^>]*>/g, '').substring(0, 160)
      : `Découvrez notre gamme ${subcategoryName.toLowerCase()} en Tunisie. Compléments alimentaires de qualité, prix compétitifs et livraison rapide.`;
    
    const imageUrl = subcat.cover 
      ? (subcat.cover.startsWith('http') ? subcat.cover : `https://www.protein.tn${subcat.cover}`)
      : "https://www.protein.tn/default-subcategory.jpg";
    
    return {
      title,
      description,
      keywords: [
        `${subcategoryName.toLowerCase()} Tunisie`,
        "compléments alimentaires",
        "nutrition sportive",
        "protein.tn",
        "livraison Tunisie",
        "sous-catégorie"
      ],
      alternates: {
        canonical: `https://www.protein.tn/subcategories/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://www.protein.tn/subcategories/${slug}`,
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 400,
            alt: subcategoryName,
          }
        ],
        siteName: "Protein.tn",
        locale: "fr_TN",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    };
  } catch {
    return {
      title: "Erreur | Protein.tn",
      description: "Une erreur s'est produite lors du chargement de la sous-catégorie."
    };
  }
}

export default async function SubcategoryPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  if (!slug) notFound();
  
  let subcategory: any = null;
  let products: any[] = [];
  let categories: any[] = [];
  let brands: any[] = [];
  
  try {
    subcategory = await getSubCategoryBySlug(slug);
    if (subcategory) {
      // Fetch products for the subcategory
      const prodRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/products?sous_categorie_id=${subcategory.id}`
      );
      products = Array.isArray(prodRes.data?.data?.products) ? prodRes.data.data.products : [];
      
      // Fetch categories
      const catRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/categories`
      );
      categories = Array.isArray(catRes.data) ? catRes.data : [];
      
      // Fetch brands
      const brandsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/brands`
      );
      brands = Array.isArray(brandsRes.data) ? brandsRes.data : [];
    }
  } catch {
    subcategory = null;
    products = [];
    categories = [];
    brands = [];
  }

  if (!subcategory) {
    notFound();
  }

  return <SubcategoryClient subcategory={subcategory} products={products} categories={categories} brands={brands} />;
}