"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import RecentlyViewdItems from "@/components/ShopDetails/RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useRouter } from "next/navigation";
import { getAllBanners } from "@/app/(admin)/dashboard/utils/banners";

// Helper to ensure only local images or fallback to placeholder
function getValidImageSrc(src?: string): string {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return "/images/placeholder.png";
  }
  if (src.startsWith("http")) {
    return src;
  }
  if (src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

const BannerProductDetails = () => {
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("tabOne");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams?.get("slug");
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setBanner(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getAllBanners()
      .then((banners) => {
        const found =
          banners.find((b: any) => b.slug === slug) ||
          banners.find((b: any) => b.id === slug) ||
          banners.find((b: any) => b._id === slug);
        setBanner(found || null);
      })
      .catch(() => setBanner(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // Tabs
  const tabs = [
    { id: "tabOne", title: "Description" },
    { id: "tabNutrition", title: "Valeurs nutritionnelles" },
    { id: "tabQuestions", title: "Questions" },
    { id: "tabThree", title: "Avis" },
  ];

  // Reviews
  const reviews = banner?.reviews || [];
  const reviewsCount = reviews.length;
  const averageRating =
    reviewsCount > 0
      ? Math.round(
          (reviews.reduce((sum: number, r: any) => sum + (parseInt(String(r.stars), 10) || 0), 0) /
            reviewsCount) *
            10
        ) / 10
      : 0;

  // Images for gallery (local only)
  const thumbnails = banner?.cover ? [getValidImageSrc(banner.cover)] : [];
  const previews = banner?.cover ? [getValidImageSrc(banner.cover)] : [];

  // Brand
  const brand = banner?.brand_id || banner?.brand || "";

  // Features
  const features = banner?.features || [];

  // Description
  const description = banner?.description_fr || banner?.description_cover || "";
  const smallDescription = banner?.description_cover || "";
  const metaDescription = banner?.meta_description_fr || "";

  // Nutrition
  const nutritionValues = banner?.nutrition_values || "";
  // Questions
  const questions = banner?.questions || "";

  // --- RENDER LOGIC ---
  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Chargement...</div>;
  }
  if (!banner) {
    return <div className="flex justify-center items-center min-h-[400px] text-red-600">Produit introuvable.</div>;
  }

  // Discount logic (move here to avoid null errors)
  const price = banner.promo && Number(banner.promo) > 0 ? Number(banner.promo) : Number(banner.price) > 0 ? Number(banner.price) : null;
  const oldPrice = banner.promo && Number(banner.promo) > 0 && Number(banner.price) > 0 ? Number(banner.price) : null;
  const discountPercentage = banner.promo && Number(banner.promo) > 0 && Number(banner.price) > 0 ? Math.round(100 - (Number(banner.promo) / Number(banner.price)) * 100) : 0;

  return (
    <>
      <Breadcrumb title={"Détails de la boutique"} pages={["shop details"]} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
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
                    <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z" fill=""/></svg>
                  </button>
                  <Image
                    src={getValidImageSrc(previews[previewImg])}
                    alt={banner.title || banner.designation_fr || "Banner"}
                    width={500}
                    height={500}
                    className="object-cover w-full h-[400px] rounded"
                  />
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                {thumbnails.map((item, key) => (
                  <button
                    onClick={() => setPreviewImg(key)}
                    key={key}
                    className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${key === previewImg ? "border-blue" : "border-transparent"}`}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={getValidImageSrc(item)}
                      alt="thumbnail"
                      className="object-cover w-full h-full rounded"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="max-w-[539px] w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                  {banner.title || banner.designation_fr || "Banner"}
                </h2>
                {discountPercentage > 0 && (
                  <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>
              {/* Brand (if available) */}
              {brand && (
                <div className="mb-2 text-sm text-gray-600">Marque: {brand}</div>
              )}
              <div className="flex flex-row flex-wrap items-center gap-5.5 mb-4.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`fill-[#FFA645]`} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_375_9172)"><path d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z" fill=""/></g><defs><clipPath id="clip0_375_9172"><rect width="18" height="18" fill="white" /></clipPath></defs></svg>
                    ))}
                  </div>
                  <span>
                    ({reviewsCount} avis client{reviewsCount !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_375_9221)"><path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" fill="#22AD5C"/><path d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z" fill="#22AD5C"/></g><defs><clipPath id="clip0_375_9221"><rect width="20" height="20" fill="white" /></clipPath></defs></svg>
                  <span className="text-green">EN Stock</span>
                </div>
              </div>
              <h3 className="font-medium text-custom-1 mb-4.5">
                <span className="text-sm sm:text-base text-dark">
                  {price ? `${price} TND` : "Prix non disponible"}
                </span>
                {oldPrice && (
                  <span className="line-through ml-2">{oldPrice} TND</span>
                )}
              </h3>
              {metaDescription ? (
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: metaDescription }} />
              ) : (
                <p className="mb-4">Découvrez notre sélection de compléments protéinés de haute qualité, idéals pour soutenir la croissance musculaire, la récupération et la performance sportive. Nos produits sont adaptés aussi bien aux débutants qu’aux athlètes confirmés.</p>
              )}
              <ul className="flex flex-col gap-2">
                {features.length > 0 && (
                  <li className="flex items-center gap-2.5">
                    <span className="font-semibold">Caractéristiques:</span>
                    <ul className="list-disc ml-5">
                      {features.map((feature: string, idx: number) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-row flex-wrap items-center gap-4.5 mt-6">
                  <div className="flex items-center rounded-md border border-gray-3">
                    <button
                      aria-label="button for remove product"
                      className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z" fill=""/></svg>
                    </button>
                    <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="button for add product"
                      className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                    >
                      <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z" fill=""/><path d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z" fill=""/></svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!banner) return;
                      const imageSrc = banner.cover ? getValidImageSrc(banner.cover) : "/images/placeholder.png";
                      let cartPrice = 0;
                      if (banner.promo && !isNaN(Number(banner.promo)) && Number(banner.promo) > 0) {
                        cartPrice = Number(banner.promo);
                      } else if (banner.price && !isNaN(Number(banner.price)) && Number(banner.price) > 0) {
                        cartPrice = Number(banner.price);
                      }
                      dispatch(
                        addItemToCart({
                          ...banner,
                          quantity,
                          image: imageSrc,
                          title: banner.title || banner.designation_fr || "Banner",
                          price: cartPrice,
                        })
                      );
                      router.push("/cart");
                    }}
                    className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
                  >
                    Achetez maintenant
                  </button>
                  <a
                    href="#"
                    className="flex items-center justify-center w-12 h-12 rounded-md border border-gray-3 ease-out duration-200 hover:text-white hover:bg-dark hover:border-transparent"
                  >
                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.62436 4.42423C3.96537 5.18256 2.75 6.98626 2.75 9.13713C2.75 11.3345 3.64922 13.0283 4.93829 14.4798C6.00072 15.6761 7.28684 16.6677 8.54113 17.6346C8.83904 17.8643 9.13515 18.0926 9.42605 18.3219C9.95208 18.7366 10.4213 19.1006 10.8736 19.3649C11.3261 19.6293 11.6904 19.75 12 19.75C12.3096 19.75 12.6739 19.6293 13.1264 19.3649C13.5787 19.1006 14.0479 18.7366 14.574 18.3219C14.8649 18.0926 15.161 17.8643 15.4589 17.6346C16.7132 16.6677 17.9993 15.6761 19.0617 14.4798C20.3508 13.0283 21.25 11.3345 21.25 9.13713C21.25 6.98626 20.0346 5.18256 18.3756 4.42423C16.7639 3.68751 14.5983 3.88261 12.5404 6.02077C12.399 6.16766 12.2039 6.25067 12 6.25067C11.7961 6.25067 11.601 6.16766 11.4596 6.02077C9.40166 3.88261 7.23607 3.68751 5.62436 4.42423ZM12 4.45885C9.68795 2.39027 7.09896 2.1009 5.00076 3.05999C2.78471 4.07296 1.25 6.42506 1.25 9.13713C1.25 11.8027 2.3605 13.8361 3.81672 15.4758C4.98287 16.789 6.41022 17.888 7.67083 18.8586C7.95659 19.0786 8.23378 19.2921 8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.66C10.6739 20.9855 11.3096 21.25 12 21.25C12.6904 21.25 13.3261 20.9855 13.8832 20.66C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999C15.7662 19.2921 16.0434 19.0786 16.3292 18.8586C17.5898 17.888 19.0171 16.789 20.1833 15.4758C21.6395 13.8361 22.75 11.8027 22.75 9.13713C22.75 6.42506 21.2153 4.07296 18.9992 3.05999C16.901 2.1009 14.3121 2.39027 12 4.45885Z" fill=""/></svg>
                  </a>
                </div>
              </form>
              {/* Social Share & Copy Link */}
              <div className="mt-8 flex flex-row flex-wrap items-center gap-3">
                {/* Facebook */}
                <button aria-label="Partager sur Facebook" className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm hover:bg-blue-600 hover:text-white transition-all duration-150" onClick={() => {window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer');}}><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></button>
                {/* Twitter */}
                <button aria-label="Partager sur Twitter" className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm hover:bg-blue-400 hover:text-white transition-all duration-150" onClick={() => {window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer');}}><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.634A9.936 9.936 0 0 0 24 4.557z"/></svg></button>
                {/* Copy Link */}
                <button aria-label="Copier le lien" className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-3 bg-white shadow-sm hover:bg-gray-300 transition-all duration-150" onClick={() => {navigator.clipboard.writeText(window.location.href);alert('Lien copié !');}}><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-2.24 1.82-4.06 4.06-4.06h4.06V6.06H7.96A5.94 5.94 0 0 0 2 12c0 3.28 2.68 5.94 5.96 5.94h4.06v-1.88H7.96A4.06 4.06 0 0 1 3.9 12zm3.06.94h10.08v-1.88H6.96v1.88zm6.08-7.88v1.88h4.06A4.06 4.06 0 0 1 21.1 12c0 2.24-1.82 4.06-4.06 4.06h-4.06v1.88h4.06A5.94 5.94 0 0 0 22 12c0-3.28-2.68-5.94-5.96-5.94h-4.06z"/></svg></button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden bg-gray-2 py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Tab header */}
          <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
            {tabs.map((item, key) => (
              <button
                key={key}
                onClick={() => setActiveTab(item.id)}
                className={`font-medium lg:text-lg ease-out duration-200 hover:text-blue relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${activeTab === item.id ? "text-blue before:w-full" : "text-dark before:w-0"}`}
              >
                {item.title}
              </button>
            ))}
          </div>
          {/* Tab content */}
          {/* Description */}
          <div>
            <div className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${activeTab === "tabOne" ? "flex" : "hidden"}`}>
              <div className="max-w-[670px] w-full">
                <h2 className="font-medium text-2xl text-dark mb-7">Caractéristiques:</h2>
                <p className="mb-6" dangerouslySetInnerHTML={{ __html: description || "Aucune description disponible." }} />
                {features.length > 0 && (
                  <ul className="list-disc ml-5">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="max-w-[447px] w-full">
                <h2 className="font-medium text-2xl text-dark mb-7">Marque et détails :</h2>
                {smallDescription ? (
                  <div className="mb-6" dangerouslySetInnerHTML={{ __html: smallDescription }} />
                ) : (
                  <p className="mb-6">voir létiquette pour la marque.</p>
                )}
              </div>
            </div>
          </div>
          {/* Nutrition Fact Tab */}
          <div>
            <div className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${activeTab === "tabNutrition" ? "block" : "hidden"}`}>
              {nutritionValues ? (
                <div dangerouslySetInnerHTML={{ __html: nutritionValues }} />
              ) : (
                <div>Aucune information nutritionnelle disponible.</div>
              )}
            </div>
          </div>
          {/* Questions Tab */}
          <div>
            <div className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${activeTab === "tabQuestions" ? "block" : "hidden"}`}>
              {questions ? (
                <div dangerouslySetInnerHTML={{ __html: questions }} />
              ) : (
                <div>Aucune question disponible.</div>
              )}
            </div>
          </div>
          {/* Reviews */}
          <div>
            <div className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${activeTab === "tabThree" ? "flex" : "hidden"}`}>
              <div className="max-w-[570px] w-full">
                <h2 className="font-medium text-2xl text-dark mb-9">{reviewsCount} Avis {reviewsCount !== 1 ? "s" : ""} sur ce produit</h2>
                <div className="flex flex-col gap-6">
                  {reviewsCount > 0 ? (
                    reviews.map((review: any, idx: number) => (
                      <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6" key={idx}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12.5 h-12.5 rounded-full overflow-hidden">
                              <Image src={review.userAvatar || "/images/users/user-01.jpg"} alt="author" className="w-12.5 h-12.5 rounded-full overflow-hidden" width={50} height={50} />
                            </div>
                            <div>
                              <h3 className="font-medium text-dark">{review.user_id ? `Utilisateur #${review.user_id}` : "Anonymous"}</h3>
                              <p className="text-custom-sm">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`cursor-pointer ${i < (parseInt(review.stars, 10) || 0) ? "text-[#FBB040]" : "text-gray-5"}`}>
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
              <div className="max-w-[550px] w-full">
                <form>
                  <h2 className="font-medium text-2xl text-dark mb-3.5">Ajouter un avis</h2>
                  <p className="mb-6">Votre adresse e-mail ne sera pas publiée. Les champs obligatoires sont indiqués. *</p>
                  <div className="flex items-center gap-3 mb-7.5">
                    <span>Your Rating*</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="cursor-pointer text-gray-5">
                          <svg className="fill-current" width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z" fill=""/></svg>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
                    <div className="mb-5">
                      <label htmlFor="comments" className="block mb-2.5">Commentaires</label>
                      <textarea name="comments" id="comments" rows={5} placeholder="Your comments" className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"></textarea>
                      <span className="flex items-center justify-between mt-2.5">
                        <span className="text-custom-sm text-dark-4">Maximum</span>
                        <span className="text-custom-sm text-dark-4">0/250</span>
                      </span>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-5 sm:gap-7.5 mb-5.5">
                      <div>
                        <label htmlFor="name" className="block mb-2.5">Nom</label>
                        <input type="text" name="name" id="name" placeholder="Your name" className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block mb-2.5">Email</label>
                        <input type="email" name="email" id="email" placeholder="Your email" className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20" />
                      </div>
                    </div>
                    <button type="submit" className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark">Soumettre des avis</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RecentlyViewdItems />

    </>
  );
};

export default BannerProductDetails;
