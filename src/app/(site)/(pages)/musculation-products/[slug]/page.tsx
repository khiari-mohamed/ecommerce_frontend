import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchMusculationProductBySlug } from "@/services/Musculationproducts";
import { MusculationProduct } from "@/types/MusculationProducts";
import { getReviewsByProduct } from "@/services/reviews";
import StarRating from "@/components/Common/StarRating";
import ReviewList from "@/components/Reviews/ReviewList";
import { Review } from "@/types/reviews";
import { Metadata } from "next";

const FALLBACK_IMAGE = "/placeholder.svg";

// Accept params as Promise<any> to match the broken .next/types
export async function generateMetadata({ params }: { params: Promise<any> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await fetchMusculationProductBySlug(resolvedParams.slug);

  if (!product) {
    return { title: "Produit non trouvé | Protein.tn" };
  }

  const productName = product.designation_fr || "Matériel de Musculation";
  const title = `${productName} - Matériel de Musculation | Protein.tn`;
  const description = `Achetez ${productName.toLowerCase()} en Tunisie sur Protein.tn. ${product.description_fr ? product.description_fr.replace(/<[^>]*>/g, '').substring(0, 150) : 'Matériel de musculation de qualité professionnelle'}. Livraison rapide en Tunisie.`;
  const imageUrl = product.cover ? (product.cover.startsWith("/") ? `https://www.protein.tn${product.cover}` : `https://www.protein.tn/${product.cover}`) : "https://www.protein.tn/default-product.jpg";
  const price = product.prix ? Number(product.prix) : null;
  const availability = product.qte && Number(product.qte) > 0 ? "InStock" : "OutOfStock";

  return {
    title,
    description,
    keywords: [
      `${productName.toLowerCase()} Tunisie`,
      "matériel musculation",
      "équipement fitness",
      "protein.tn",
      "livraison Tunisie",
      product.brand_id || "fitness"
    ],
    alternates: {
      canonical: `https://www.protein.tn/musculation-products/${resolvedParams.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.protein.tn/musculation-products/${resolvedParams.slug}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: productName,
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
    other: {
      ...(price && { "product:price:amount": price.toString() }),
      "product:price:currency": "TND",
      "product:availability": availability,
      ...(product.brand_id && { "product:brand": product.brand_id }),
    },
  };
}

export default async function MusculationProductPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) {
    notFound();
  }

  let product: MusculationProduct | null = null;
  let reviews: Review[] = [];
  let averageRating = 0;

  try {
    product = await fetchMusculationProductBySlug(slug);
    if (product && product._id) {
      reviews = await getReviewsByProduct(product._id);
      if (reviews.length > 0) {
        averageRating =
          reviews.reduce((acc, r) => acc + parseInt(r.stars, 10), 0) / reviews.length;
      }
    }
  } catch (e) {
    product = null;
  }

  if (!product) {
    notFound();
  }

  const getImageSrc = () => {
    if (product && product.cover && product.cover.trim() !== "") {
      return product.cover.startsWith("/") ? product.cover : "/" + product.cover;
    }
    return FALLBACK_IMAGE;
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-1/2">
          <Image
            src={getImageSrc()}
            alt={product?.designation_fr || "Produit"}
            width={500}
            height={500}
            className="object-contain w-full h-auto rounded-lg bg-gray-50"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product?.designation_fr}</h1>
          <div className="flex items-center mb-2">
            <StarRating rating={averageRating} />
            <span className="ml-2 text-sm text-gray-500">
              {reviews.length > 0
                ? `(${reviews.length} avis)`
                : "(Aucun avis)"}
            </span>
          </div>
          <div className="mb-2 text-lg text-gray-700">
            <span className="font-semibold">Prix: </span>
            {product && Number(product.prix).toLocaleString("fr-TN", {
              style: "currency",
              currency: "TND",
            })}
            {product?.promo && (
              <span className="ml-2 text-red-500 line-through">
                {Number(product.promo).toLocaleString("fr-TN", {
                  style: "currency",
                  currency: "TND",
                })}
              </span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Marque: </span>
            {product?.brand_id || "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Stock: </span>
            {product?.qte && Number(product.qte) > 0
              ? "En stock"
              : "Rupture de stock"}
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{
                __html: product?.description_fr || "Aucune description disponible.",
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Avis des clients</h2>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}

