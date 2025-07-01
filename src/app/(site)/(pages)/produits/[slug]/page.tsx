
"use client";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getReviewsByProduct } from "@/services/reviews";
import StarRating from "@/components/Common/StarRating";
import ReviewList from "@/components/Reviews/ReviewList";
import { Review } from "@/types/reviews";
import ProductFlavors from "@/components/product/ProductFlavors";
import type { Aroma } from "@/types/aroma";
import axios from "axios";
// Helper to strip HTML tags for meta description
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

function getProductImageUrl(product: any, apiUrl: string) {
  if (product?.mainImage?.url) {
    if (product.mainImage.url.startsWith("http")) return product.mainImage.url;
    return apiUrl.replace(/\/$/, "") + "/" + product.mainImage.url.replace(/^\/+/, "");
  }
  if (product?.cover) {
    if (product.cover.startsWith("http")) return product.cover;
    return apiUrl.replace(/\/$/, "") + "/" + product.cover.replace(/^\/+/, "");
  }
  return null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Aromas state
  const [aromas, setAromas] = useState<Aroma[]>([]);
  useEffect(() => {
    fetch("/api/aromas")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAromas(data);
        } else if (data && Array.isArray(data.aromas)) {
          setAromas(data.aromas);
        } else {
          setAromas([]);
        }
      })
      .catch(() => setAromas([]));
  }, []);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`${API_URL}/products/slug/${slug}`);
        if (!res.data?.product) return notFound();
        setProduct(res.data.product);

        // Use the same logic as dashboard for product ID
        const prodId = res.data.product.id ? String(res.data.product.id) : String(res.data.product._id);
        console.log("Product ID used for reviews:", prodId);

        if (prodId) {
          const reviewsData = await getReviewsByProduct(prodId);
          setReviews(reviewsData);
          if (reviewsData.length > 0) {
            const avg = reviewsData.reduce(
              (sum, r) => sum + (r.rating || parseInt(String(r.stars ?? "0"), 10)),
              0
            ) / reviewsData.length;
            setAverageRating(avg);
          }
          // Debug: log what you get
          console.log("Fetched reviews:", reviewsData);
        }
      } catch (err) {
        notFound();
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-lg text-gray-400">Chargement...</span>
      </div>
    );
  }

  if (!product) return notFound();
  
  const imageSrc = getProductImageUrl(product, API_URL);
  
  const price = product.price !== undefined && product.price !== null ? parseFloat(product.price) : null;
  const oldPrice = product.oldPrice !== undefined && product.oldPrice !== null ? parseFloat(product.oldPrice) : null;
  
  const description =
  (product.description && product.description.trim() !== "")
  ? product.description
  : (product.meta_description_fr && product.meta_description_fr.trim() !== "")
  ? product.meta_description_fr
  : "Aucune description disponible.";
  
  const brand = product.brand_id || "N/A";
  const inStock = product.qte && Number(product.qte) > 0;
  const codeProduit = product.code_product && product.code_product.trim() !== "" ? product.code_product : "N/A";
  
  // --- SEO STRUCTURED DATA ---
  // Place this as the first child in your main container
  const structuredData = {
  "@context": "https://schema.org/",
  "@type": "Product",
  name: product.designation_fr || product.designation,
  description: stripHtml(
  product.meta_description_fr ||
  product.description_cover ||
  product.content_seo ||
  product.description ||
  ""
  ),
  image: imageSrc,
  brand: { "@type": "Brand", name: brand },
  aggregateRating: reviews.length > 0
  ? {
  "@type": "AggregateRating",
  ratingValue: averageRating,
  reviewCount: reviews.length,
  }
  : undefined,
  review: reviews.map(r => ({
  "@type": "Review",
  reviewRating: {
  "@type": "Rating",
  ratingValue: r.rating || parseInt(r.stars ?? "0", 10),
  bestRating: 5,
  },
  author: {
  "@type": "Person",
  name: r.user_id ? `Utilisateur #${r.user_id}` : "Anonyme",
  },
  datePublished: r.created_at,
  reviewBody: r.comment || "",
  })),
  offers: {
  "@type": "Offer",
  priceCurrency: "TND",
  price: product.price || product.promo || "",
  availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  url: `https://protein.tn/shop/${product.slug}`,
  seller: {
  "@type": "Organization",
  name: "SOBITAS",
  url: "https://protein.tn/"
  }
  }
  };
  
  return (
  <div className="max-w-4xl mx-auto py-12 px-4">
  {/* SEO Structured Data for Google Rich Snippets */}
  <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
  />
  <div className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-lg p-6">
  {/* Product Image */}
  <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
  {imageSrc ? (
  <Image
  src={imageSrc}
  alt={product.designation_fr || product.designation || "Image du produit"}
  width={400}
  height={400}
  className="object-contain w-full h-auto rounded-lg bg-gray-50 border"
  priority
  />
  ) : (
  <div className="w-[400px] h-[400px] flex items-center justify-center bg-gray-100 text-gray-400 border rounded-lg">
  Pas d'image
  </div>
  )}
  </div>
  {/* Product Info */}
  <div className="flex-1 flex flex-col justify-between">
  <div>
  <h1 className="text-3xl font-bold mb-2 text-blue-900">{product.designation_fr || product.designation}</h1>
  {/* Star Rating */}
  <div className="flex items-center mb-2">
  <StarRating rating={averageRating} />
  <span className="ml-2 text-sm text-gray-500">
  {reviews.length > 0 ? `(${reviews.length} avis)` : "(Aucun avis)"}
  </span>
  </div>
  <div className="mb-3 text-lg text-gray-700 flex items-center gap-3">
  <span className="font-semibold">Prix:</span>
  {price !== null ? (
  <span className="text-green-700 font-bold">
  {price.toLocaleString("fr-FR", { style: "currency", currency: "TND" })}
  </span>
  ) : (
  <span>N/A</span>
  )}
  {oldPrice && (
  <span className="ml-2 text-red-500 line-through">
  {oldPrice.toLocaleString("fr-FR", { style: "currency", currency: "TND" })}
  </span>
  )}
  </div>
  <div className="mb-2">
  <span className="font-semibold">Marque:</span>{" "}
  <span className="text-gray-800">{brand}</span>
  </div>
  <div className="mb-2">
  <span className="font-semibold">Stock:</span>{" "}
  <span className={inStock ? "text-green-700" : "text-red-600"}>
  {inStock ? "En stock" : "Rupture de stock"}
  </span>
  </div>
  {/* Flavor */}
  {product.aroma_ids && product.aroma_ids.length > 0 && aromas.length > 0 && (
  (() => {
  const matchedAromas = product.aroma_ids
  .map((id: string) => aromas.find((aroma) => String(aroma.id) === String(id)))
  .filter(Boolean);
  if (matchedAromas.length === 0) return null;
  return (
  <div className="flex items-center gap-4 mb-2">
  <div className="min-w-[65px]">
  <h4 className="font-medium text-dark">Flavor:</h4>
  </div>
  <div className="flex flex-wrap gap-2">
  <ProductFlavors
  aroma_ids={product.aroma_ids}
  aromas={aromas}
  />
  </div>
  </div>
  );
  })()
  )}
  <div className="mb-4">
  <span className="font-semibold">Code produit:</span>{" "}
  <span className="text-gray-700">{codeProduit}</span>
  </div>
  <div className="mb-6">
  <h2 className="text-xl font-semibold mb-1 text-blue-800">Description</h2>
  <div
  className="text-gray-700 leading-relaxed"
  dangerouslySetInnerHTML={{
  __html: description,
  }}
  />
  </div>
  {product.nutrition_values && (
  <section className="mb-6">
  <h2 className="text-xl font-semibold mb-1 text-blue-800">Valeurs nutritionnelles</h2>
  <div
  className="bg-gray-50 border rounded p-3 text-gray-700 text-sm"
  dangerouslySetInnerHTML={{ __html: product.nutrition_values }}
  />
  </section>
  )}
  {product.questions && (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-1 text-blue-800">Questions fréquentes</h2>
    <div
      className="bg-gray-50 border rounded p-3 text-gray-700 text-sm"
      dangerouslySetInnerHTML={{ __html: product.questions }}
    />
  </section>
  )}
  </div>
  </div>
  </div>
  {/* Reviews Section */}
  <div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">Avis des clients</h2>
  <ReviewList reviews={reviews} />
  {/* Debug output: Remove after testing */}
  <pre style={{ color: "#888", fontSize: 12 }}>{JSON.stringify(reviews, null, 2)}</pre>
  </div>
  </div>
  );
  }