import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchMusculationProductBySlug } from "@/services/Musculationproducts";
import { MusculationProduct } from "@/types/MusculationProducts";
import { getReviewsByProduct } from "@/services/reviews";
import StarRating from "@/components/Common/StarRating";
import ReviewList from "@/components/Reviews/ReviewList";
import { Review } from "@/types/reviews";

const FALLBACK_IMAGE = "/placeholder.svg";

// ✅ Only this now — NO "interface MusculationProductPageProps"
export default async function SubcategoryPage({
  params,
}: {
  params?: { slug: string } | Promise<{ slug: string }>;
}) {
  let resolvedParams: { slug: string } | undefined;
  if (params && typeof (params as Promise<any>).then === "function") {
    resolvedParams = await params as { slug: string };
  } else {
    resolvedParams = params as { slug: string } | undefined;
  }
  const slug = resolvedParams?.slug;

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
    if (product.cover && product.cover.trim() !== "") {
      return product.cover.startsWith("/") ? product.cover : "/" + product.cover;
    }
    return FALLBACK_IMAGE;
  };

  return (
    // ...rest of your JSX stays exactly the same
  

    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-1/2">
          <Image
            src={getImageSrc()}
            alt={product.designation_fr}
            width={500}
            height={500}
            className="object-contain w-full h-auto rounded-lg bg-gray-50"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.designation_fr}</h1>
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
            {Number(product.prix).toLocaleString("fr-TN", {
              style: "currency",
              currency: "TND",
            })}
            {product.promo && (
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
            {product.brand_id || "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Stock: </span>
            {product.qte && Number(product.qte) > 0
              ? "En stock"
              : "Rupture de stock"}
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{
                __html: product.description_fr || "Aucune description disponible.",
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

