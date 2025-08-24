"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import RecentlyViewdItems from "@/components/ShopDetails/RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useParams } from "next/navigation";
import type { Product } from "@/types/product";
import ProductBrandAroma from "@/components/product/ProductBrandAroma";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useRouter } from "next/navigation";
import ProductFlavors from "@/components/product/ProductFlavors";
import type { Aroma } from "@/types/aroma";
import ReviewForm from "@/components/ProductDetails/ReviewForm";
import axiosInstance from "@/lib/axios";

// Helper to ensure only local images or fallback to placeholder
function getValidImageSrc(src?: string): string {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return "/images/placeholder.png";
  }
  let cleanSrc = src.trim().replace(/\\/g, "/").replace(/\\/g, "/");
  if (cleanSrc.startsWith("http")) return cleanSrc;
  if (!cleanSrc.startsWith("/")) cleanSrc = "/" + cleanSrc;
  return cleanSrc;
}

// Enhanced image URL with backend fallback for new images
function getEnhancedImageSrc(src?: string): string {
  const validSrc = getValidImageSrc(src);
  
  // Check if this is a NEW backend-served image (contains August2025 pattern)
  if (validSrc && validSrc.includes('August2025')) {
    const backendUrl = 'http://145.223.118.9:5000';
    return `${backendUrl}${validSrc}`;
  }
  
  return validSrc;
}

type ProductReview = {
  user_id: any;
  userAvatar?: string;
  userName?: string;
  createdAt?: string;
  rating?: number;
  stars?: string;
  comment?: string;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [activeFlavor, setActiveFlavor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const [activeType, setActiveType] = useState<string>("");
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("tabOne");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    axiosInstance
      .get(`/products/slug/${slug}`)
      .then((res) => {
        let response = res.data;
        let rawProduct = response?.product?.data || response?.product || response;
        if (rawProduct && rawProduct.product) {
          rawProduct = rawProduct.product;
        }
        if (!rawProduct) {
          setProduct(null);
          return;
        }
        setProduct(normalizeProduct(rawProduct));
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  function normalizeProduct(raw: any): Product {
    return {
      title: raw.title || raw.designation_fr || raw.designation || "",
      price: Number(raw.price ?? raw.prix ?? 0),
      discountedPrice:
        Number(raw.discountedPrice ?? raw.promo ?? raw.promo_ht ?? raw.price ?? raw.prix ?? 0),
      id: Number(raw.id ?? raw._id ?? 0),
      imgs: {
        thumbnails:
          raw.images?.map((img: any) => img.url) ||
          (raw.mainImage?.url ? [raw.mainImage.url] : []),
        previews:
          raw.images?.map((img: any) => img.url) ||
          (raw.mainImage?.url ? [raw.mainImage.url] : []),
      },
      currency: raw.currency || "TND",
      _id: raw._id || "",
      designation: raw.designation || "",
      slug: raw.slug || "",
      oldPrice: Number(raw.oldPrice ?? raw.prix_ht ?? raw.promo ?? 0) || undefined,
      mainImage: raw.mainImage || { url: "" },
      images: raw.images || [],
      inStock: raw.inStock ?? (raw.rupture === "0" ? true : false),
      reviews: raw.reviews || [],
      features: raw.features || [],
      aroma_ids: raw.aroma_ids || [],
      brand: raw.brand || "",
      smallDescription: raw.smallDescription || raw.description_cover || "",
      description: raw.description || raw.description_fr || "",
      meta_description_fr: raw.meta_description_fr || "",
      category: raw.category || "",
      subCategory: raw.subCategory || [],
      venteflashDate: raw.venteflashDate || undefined,
      isFlashSale: raw.isFlashSale || false,
      discountPercentage: raw.discountPercentage || undefined,
      type: raw.type || "",
      isNewProduct:
        raw.isNewProduct !== undefined
          ? raw.isNewProduct
          : raw.isNewArrival !== undefined
          ? raw.isNewArrival
          : raw.new_product === "1",
      isBestSeller:
        raw.isBestSeller !== undefined
          ? raw.isBestSeller
          : raw.bestSellerSection !== undefined
          ? raw.bestSellerSection
          : raw.best_seller === "1",
      isOutOfStock: raw.isOutOfStock ?? (raw.rupture === "1" ? true : false),
      isPublished:
        raw.isPublished !== undefined ? raw.isPublished : raw.publier === "1",
      aggregateRating: raw.aggregateRating ?? (raw.note ? Number(raw.note) : undefined),
      promoExpirationDate: raw.promoExpirationDate ?? raw.promo_expiration_date ?? undefined,
      sous_categorie_id:
        raw.sous_categorie_id ?? raw.sousCategorieId ?? raw.subCategoryId ?? "",
      cover: raw.cover || raw.mainImage?.url || "",
      nutrition_values: raw.nutrition_values || "",
      questions: raw.questions || "",
      zone1: raw.zone1 || "",
      zone2: raw.zone2 || "",
      zone3: raw.zone3 || "",
      zone4: raw.zone4 || "",
      content_seo: raw.content_seo || raw.contentSeo || "",
      meta: raw.meta || "",
      pack: raw.pack || "",
    };
  }

  const tabs = [
    { id: "tabOne", title: "Description" },
    { id: "tabNutrition", title: "Valeurs nutritionnelles" },
    { id: "tabQuestions", title: "Questions" },
    { id: "tabThree", title: "Avis" },
  ];

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Chargement...</div>;
  }
  if (!product) {
    return <div className="flex justify-center items-center min-h-[400px] text-red-600">Produit introuvable.</div>;
  }

  const imageCandidates = [
    ...(product?.imgs?.previews || []),
    ...(product?.imgs?.thumbnails || []),
    product?.cover,
    product?.mainImage?.url,
  ]
    .map(getValidImageSrc)
    .filter(
      (src, idx, arr) =>
        src !== "/images/placeholder.png" &&
        !!src &&
        arr.indexOf(src) === idx // remove duplicates
    );

  const previews = imageCandidates.length > 0 ? imageCandidates : ["/images/placeholder.png"];
  const thumbnails = previews;

  const reviews: ProductReview[] = (product?.reviews || []).map((review: any) => ({
    ...review,
    stars: review.stars !== undefined ? String(review.stars) : undefined,
  }));
  const reviewsCount = reviews.length;
  const averageRating =
    reviewsCount > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + (parseInt(String(r.stars), 10) || 0), 0) / reviewsCount) * 10
        ) / 10
      : 0;

  const flavors = product?.features || ["Vanilla", "Chocolate", "Strawberry"];

  let priceA = Number(product.price);
  let priceB = Number(product.discountedPrice);
  let oldPrice = priceA > priceB ? priceA : priceB;
  let promoPrice = priceA > priceB ? priceB : priceA;
  let hasDiscount = priceA !== priceB;
  let discount = hasDiscount && oldPrice > 0 ? Math.round(100 - (promoPrice / oldPrice) * 100) : 0;

  return (
    <div className="product-details-page">
      <Breadcrumb title={"Détails du produit"} pages={["product details"]} />
      <section className="pt-4 pb-8 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            {/* Image Gallery */}
            <div className="lg:max-w-[570px] w-full">
              <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                <div>
                  <button
                    onClick={openPreviewModal}
                    aria-label="button for zoom"
                    className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                  >
                    {/* SVG icon */}
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                      fill=""
                    />
                  </svg>
                  </button>
                  <Image
                    src={getEnhancedImageSrc((previews && previews[previewImg]) ?? "")}
                    alt={product?.title ? `Aperçu de ${product.title}` : "Aperçu produit"}
                    width={500}
                    height={500}
                    className="object-cover w-full max-w-full h-auto rounded"
                    style={{ maxHeight: '400px' }}
                    unoptimized={getValidImageSrc((previews && previews[previewImg]) ?? "")?.includes('August2025')}
                  />
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                {thumbnails.map((item, key) => (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreviewImg(key);
                    }}
                    key={key}
                    className={`flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-[#ff6600] ${
                      key === previewImg ? "border-[#ff6600]" : "border-transparent"
                    }`}
                    tabIndex={0}
                    aria-label={`Show preview ${key + 1}`}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={getEnhancedImageSrc(item ?? "")}
                      alt={product?.title ? `Miniature de ${product.title}` : `Miniature produit ${key + 1}`}
                      className="object-cover w-full max-w-full h-auto rounded"
                      unoptimized={getValidImageSrc(item ?? "")?.includes('August2025')}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                  {product?.title || ""}
                </h2>
                {hasDiscount && discount > 0 && (
                  <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5 self-start">
                    {discount}% OFF
                  </div>
                )}
              </div>
              <ProductBrandAroma brandId={typeof product?.brand === "string" ? product?.brand : (product?.brand as any)?._id || ""} />
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-5.5 mb-4.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`fill-[#FFA645]`}
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9172)"><path d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z" fill=""/></g><defs><clipPath id="clip0_375_9172"><rect width="18" height="18" fill="white" /></clipPath></defs></svg>
                    ))}
                  </div>
                  
                </div>
                <div className="flex items-center gap-1.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_375_9221)">
                      <path
                        d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                        fill="#22AD5C"
                      />
                      <path
                        d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                        fill="#22AD5C"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_375_9221">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="text-green">{product?.inStock ? "en Stock" : "Rupture de Stock"}</span>
                </div>
              </div>
              <h3 className="font-medium text-custom-1 mb-4.5">
                <span className="text-sm sm:text-base text-dark">
                  Prix: {product?.oldPrice && product?.oldPrice > product?.price ? (
                    <>
                      <span className="mr-2">{product?.oldPrice} {product?.currency || "TND"}</span>
                      <span className="line-through font-bold text-blue-700">{product?.price} {product?.currency || "TND"}</span>
                    </>
                  ) : (
                    <>
                      <span className="line-through font-bold text-blue-700">{product?.price} {product?.currency || "TND"}</span>
                      {product?.oldPrice && product?.oldPrice < product?.price && (
                        <span className="mr-2">{product?.oldPrice} {product?.currency || "TND"}</span>
                      )}
                    </>
                  )}
                </span>
              </h3>
              {product?.meta_description_fr ? (
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: product?.meta_description_fr }} />
              ) : (
                <p className="mb-4">
                  Découvrez notre sélection de compléments protéinés de haute qualité, idéals pour soutenir la croissance musculaire, la récupération et la performance sportive. Nos produits sont adaptés aussi bien aux débutants qu’aux athlètes confirmés.
                </p>
              )}
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                 
                  </svg>
                </li>
                <li className="flex items-center gap-2.5">
                  {/* SVG icon for discount */}
                </li>
              </ul>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">
                  {/* Flavor */}
                  {product && Array.isArray(product.aroma_ids) && product.aroma_ids.length > 0 && aromas.length > 0 && (
                    (() => {
                      const matchedAromas = product?.aroma_ids
                        ?.map((id: string) => aromas.find((aroma) => String(aroma?.id ?? "") === String(id ?? "")))
                        .filter(Boolean) ?? [];
                      if (matchedAromas.length === 0) return null;
                      return (
                        <div className="flex items-center gap-4">
                          <div className="min-w-[65px]">
                            <h4 className="font-medium text-dark">saveur:</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <ProductFlavors
                              aroma_ids={product.aroma_ids}
                              aromas={aromas}
                              activeFlavor={activeFlavor}
                              setActiveFlavor={setActiveFlavor}
                            />
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  {/* First row: Quantity, Add to Cart, Heart */}
                  <div className="flex flex-row flex-wrap items-center gap-4.5">
                    <div className="flex items-center rounded-md border border-gray-3">
                      <button aria-label="button for remove product" className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-[#ff6600]" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z" fill=""/></svg>
                      </button>
                      <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} aria-label="button for add product" className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-[#ff6600]">
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z" fill=""/><path d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z" fill=""/></svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!product) return;
                        const imageSrc =
                          product.cover
                            ? "/" + product.cover.replace(/^\/+/, "")
                            : product.mainImage?.url
                            ? product.mainImage.url
                            : product.imgs?.previews?.[0]
                            ? product.imgs.previews[0]
                            : product.imgs?.thumbnails?.[0]
                            ? product.imgs.thumbnails[0]
                            : "/images/placeholder.png";
                        dispatch(
                          addItemToCart({
                            ...product,
                            id: String(product?.id ?? product?._id ?? ""), // Ensure id is a string
                            quantity,
                            image: imageSrc,
                          })
                        );
                        router.push("/cart");
                      }}
                      className="inline-flex font-medium text-white py-3 px-7 rounded-md ease-out duration-200" style={{background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)'}}
                    >
                      Ajouter au panier
                    </button>
                    <button type="button" aria-label="Ajouter aux favoris" className="flex items-center justify-center w-12 h-12 rounded-md border border-gray-3 ease-out duration-200 hover:text-white" style={{color: '#ff6600', borderColor: '#ff6600'}}>
                      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.62436 4.42423C3.96537 5.18256 2.75 6.98626 2.75 9.13713C2.75 11.3345 3.64922 13.0283 4.93829 14.4798C6.00072 15.6761 7.28684 16.6677 8.54113 17.6346C8.83904 17.8643 9.13515 18.0926 9.42605 18.3219C9.95208 18.7366 10.4213 19.1006 10.8736 19.3649C11.3261 19.6293 11.6904 19.75 12 19.75C12.3096 19.75 12.6739 19.6293 13.1264 19.3649C13.5787 19.1006 14.0479 18.7366 14.574 18.3219C14.8649 18.0926 15.161 17.8643 15.4589 17.6346C16.7132 16.6677 17.9993 15.6761 19.0617 14.4798C20.3508 13.0283 21.25 11.3345 21.25 9.13713C21.25 6.98626 20.0346 5.18256 18.3756 4.42423C16.7639 3.68751 14.5983 3.88261 12.5404 6.02077C12.399 6.16766 12.2039 6.25067 12 6.25067C11.7961 6.25067 11.601 6.16766 11.4596 6.02077C9.40166 3.88261 7.23607 3.68751 5.62436 4.42423ZM12 4.45885C9.68795 2.39027 7.09896 2.1009 5.00076 3.05999C2.78471 4.07296 1.25 6.42506 1.25 9.13713C1.25 11.8027 2.3605 13.8361 3.81672 15.4758C4.98287 16.789 6.41022 17.888 7.67083 18.8586C7.95659 19.0786 8.23378 19.2921 8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.66C10.6739 20.9855 11.3096 21.25 12 21.25C12.6904 21.25 13.3261 20.9855 13.8832 20.66C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999C15.7662 19.2921 16.0434 19.0786 16.3292 18.8586C17.5898 17.888 19.0171 16.789 20.1833 15.4758C21.6395 13.8361 22.75 11.8027 22.75 9.13713C22.75 6.42506 21.2153 4.07296 18.9992 3.05999C16.901 2.1009 14.3121 2.39027 12 4.45885Z" fill=""/></svg>
                    </button>
                  </div>
                  {/* Second row: Social media icons */}
                  <div className="flex flex-row flex-wrap items-center gap-3">
                {/* Facebook */}
                <button
                  aria-label="Partager sur Facebook"
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                  onClick={() => {
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                </button>
                {/* Twitter */}
                <button
                  aria-label="Partager sur Twitter"
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.634A9.936 9.936 0 0 0 24 4.557z"/></svg>
                </button>
                {/* WhatsApp */}
                <button
                  aria-label="Partager sur WhatsApp"
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                  onClick={() => {
                    window.open(
                      `https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.991c-.003 5.451-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05.001C5.495.001.001 5.495 0 12.049c0 2.124.557 4.199 1.615 6.032L.057 23.944a1.001 1.001 0 0 0 1.212 1.212l5.814-1.557a11.96 11.96 0 0 0 5.006 1.104h.005c6.554 0 11.848-5.393 11.85-11.947a11.821 11.821 0 0 0-3.482-8.627"/></svg>
                </button>
                {/* LinkedIn */}
                <button
                  aria-label="Partager sur LinkedIn"
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                  onClick={() => {
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                </button>
                {/* Reddit */}
                <button
                  aria-label="Partager sur Reddit"
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                  onClick={() => {
                    window.open(
                      `https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 6.627 5.373 12 12 12s12-5.373 12-12zm-17.25 2.25c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm8.5 0c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm-4.25 2.25c0 1.104 2.239 2 5 2s5-.896 5-2v-1h-10v1zm10.5-2.25c0-2.485-2.015-4.5-4.5-4.5s-4.5 2.015-4.5 4.5h9zm-9.5-2.25c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm8.5 0c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm-4.25-2.25c0-1.104-2.239-2-5-2s-5 .896-5 2v1h10v-1zm-10.5 2.25c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5h-9zm9.5-2.25c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm8.5 0c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm-4.25-2.25c0-1.104-2.239-2-5-2s-5 .896-5 2v1h10v-1zm-10.5 2.25c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5h-9zm9.5-2.25c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75zm8.5 0c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75-.784 1.75-1.75 1.75-1.75-.784-1.75-1.75z"/></svg>
                </button>
                {/* Instagram (opens profile, as Instagram does not support direct share links) */}
                <button
                  aria-label="Voir sur Instagram"
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                  onClick={() => {
                    window.open(
                      `https://www.instagram.com/`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.059-1.281.292-2.393 1.272-3.373.98-.98 2.092-1.213 3.373-1.272C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.281.292 2.393 1.272 3.373.98.98 2.092 1.213 3.373 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.373-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.292-2.393-1.272-3.373-.98-.98-2.092-1.213-3.373-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </button>
                {/* Copy Link */}
                <button
                  aria-label="Copier le lien"
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm transition-all duration-150" style={{color: '#ff6600', borderColor: '#ff6600'}}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Lien copié !');
                  }}
                >
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-2.24 1.82-4.06 4.06-4.06h4.06V6.06H7.96A5.94 5.94 0 0 0 2 12c0 3.28 2.68 5.94 5.96 5.94h4.06v-1.88H7.96v1.88zm6.08-7.88v1.88h4.06A4.06 4.06 0 0 1 21.1 12c0 2.24-1.82 4.06-4.06 4.06h-4.06v1.88h4.06A5.94 5.94 0 0 0 22 12c0-3.28-2.68-5.94-5.96-5.94h-4.06z"/></svg>
                </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Tabs, Reviews, Newsletter, etc. */}
      <section className="py-20 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab header */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center bg-white rounded-[10px] shadow-1 gap-3 sm:gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
            {tabs.map((item, key) => (
              <button
                key={key}
                onClick={() => setActiveTab(item.id)}
                className={`font-medium lg:text-lg ease-out duration-200 hover:text-[#ff6600] relative before:h-0.5 before:bg-[#ff6600] before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${
                  activeTab === item.id ? "text-[#ff6600] before:w-full" : "text-dark before:w-0"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          {/* Tab content */}
          {/* Description */}
          <div>
            <div className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${activeTab === "tabOne" ? "flex" : "hidden"}`}>
              <div className="w-full max-w-2xl">
                <h2 className="font-medium text-2xl text-dark mb-7">Caractéristiques:</h2>
                <p className="mb-6" dangerouslySetInnerHTML={{ __html: product?.description || "Aucune description disponible." }} />
                {product?.features?.length ? (
                  <ul className="list-disc ml-5">
                    {product?.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="w-full max-w-lg">
                <h2 className="font-medium text-2xl text-dark mb-7">Marque et détails :</h2>
                <p className="mb-6">{product?.brand || "voir l'étiquette pour la marque."}</p>
                {product?.smallDescription ? (
                  <div className="mb-6" dangerouslySetInnerHTML={{ __html: product?.smallDescription }} />
                ) : (
                  <p className="mb-6">voir létiquette pour la marque.</p>
                )}
              </div>
            </div>
          </div>
          {/* Nutrition Fact Tab */}
          <div className={`mt-10 ${activeTab === "tabNutrition" ? "block" : "hidden"}`}>
            {product?.nutrition_values ? (
              <div dangerouslySetInnerHTML={{ __html: product?.nutrition_values }} />
            ) : (
              <div>Aucune information nutritionnelle disponible.</div>
            )}
          </div>
          {/* Questions Tab */}
          <div className={`mt-10 ${activeTab === "tabQuestions" ? "block" : "hidden"}`}>
            {product?.questions ? (
              <div dangerouslySetInnerHTML={{ __html: product?.questions }} />
            ) : (
              <div>Aucune question disponible.</div>
            )}
          </div>
          {/* Reviews */}
          <div>
            <div className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${activeTab === "tabThree" ? "flex" : "hidden"}`}>
              <div className="w-full max-w-xl">
                <h2 className="font-medium text-2xl text-dark mb-9">{reviewsCount} Avis {reviewsCount !== 1 ? "s" : ""} sur ce produit</h2>
                <div className="flex flex-col gap-6">
                  {reviewsCount > 0 ? (
                    reviews.map((review, idx) => (
                      <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6" key={idx}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <Image
                                src={review.userAvatar || "/images/users/user-01.jpg"}
                                alt={review.userName ? `Avatar de ${review.userName}` : "Avatar utilisateur"}
                                className="w-full h-auto rounded-full overflow-hidden"
                                width={50}
                                height={50}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-dark">{review.user_id ? `Utilisateur #${review.user_id}` : "Anonymous"}</h3>
                              <p className="text-custom-sm">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`cursor-pointer ${i < (parseInt(review.stars ?? "0", 10) || 0) ? "text-[#FBB040]" : "text-gray-5"}`}>
                                <svg className="fill-current" width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z" fill=""/></svg>
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-dark mt-6">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-dark">Aucun avis pour le moment.</div>
                  )}
                </div>
              </div>
              <div className="w-full max-w-xl">
                <ReviewForm productId={String(product?.id ?? product?._id ?? "")} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <RecentlyViewdItems />
    </div>
  );
}
