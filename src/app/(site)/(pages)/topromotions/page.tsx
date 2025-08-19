"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import type { TopPromotion } from "@/types/top-promotion";

function getValidImageSrc(src?: string): string {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return "/images/placeholder.png";
  }
  let cleanSrc = src.trim().replace(/\\/g, "/").replace(/\\/g, "/");
  if (cleanSrc.startsWith("http")) return cleanSrc;
  if (!cleanSrc.startsWith("/")) cleanSrc = "/" + cleanSrc;
  return cleanSrc;
}

export default function TopPromotionsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [promotion, setPromotion] = useState<TopPromotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      setPromotion(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    axiosInstance
      .get(`/top-promotions`)
      .then((res) => {
        const promotions = res.data.data || [];
        const foundPromo = promotions.find((p: TopPromotion) => p._id === id);
        setPromotion(foundPromo || null);
      })
      .catch(() => setPromotion(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Chargement...</div>;
  }
  if (!promotion) {
    return <div className="flex justify-center items-center min-h-[400px] text-red-600">Promotion introuvable.</div>;
  }

  const imageUrl = promotion.product?.cover || promotion.product?.mainImage?.url || "/images/placeholder.png";
  const hasDiscount = promotion.prix > promotion.promo;
  const discount = hasDiscount ? Math.round(((promotion.prix - promotion.promo) / promotion.prix) * 100) : 0;

  return (
    <div className="promotion-details-page">
      <Breadcrumb title={"Détails de la promotion"} pages={["promotion details"]} />
      <section className="pt-4 pb-8 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            {/* Image Gallery */}
            <div className="lg:max-w-[570px] w-full">
              <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                <Image
                  src={getValidImageSrc(imageUrl)}
                  alt={promotion.designation_fr}
                  width={500}
                  height={500}
                  className="object-cover w-full max-w-full h-auto rounded"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            </div>
            <div className="w-full max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                  {promotion.designation_fr}
                </h2>
                {hasDiscount && discount > 0 && (
                  <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5 self-start">
                    {discount}% OFF
                  </div>
                )}
              </div>
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
                  <span className="text-green">{promotion.rupture === "0" ? "En Stock" : "Rupture de Stock"}</span>
                </div>
              </div>
              <h3 className="font-medium text-custom-1 mb-4.5">
                <span className="text-sm sm:text-base text-dark">
                  Prix: <span className="line-through text-gray-500 mr-2">{promotion.prix} TND</span>
                  <span className="font-bold text-blue-700">{promotion.promo} TND</span>
                </span>
              </h3>
              <p className="mb-4">
                Profitez de cette offre exceptionnelle sur {promotion.designation_fr}. 
                Économisez {discount}% sur ce produit de qualité.
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
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
                        const productData = {
                          id: promotion._id,
                          title: promotion.designation_fr,
                          price: promotion.prix,
                          discountedPrice: promotion.promo,
                          quantity,
                          image: getValidImageSrc(imageUrl),
                          _id: promotion._id
                        };
                        dispatch(addItemToCart(productData));
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
      <style jsx>{`
        /* Fix excessive spacing on promotion details page */
        .promotion-details-page :global(.shadow-breadcrumb) {
          padding-top: 0px !important;
        }
        @media (min-width: 640px) {
          .promotion-details-page :global(.shadow-breadcrumb) {
            padding-top: 5px !important;
          }
        }
        @media (min-width: 1024px) {
          .promotion-details-page :global(.shadow-breadcrumb) {
            padding-top: 20px !important;
          }
        }
        @media (min-width: 1280px) {
          .promotion-details-page :global(.shadow-breadcrumb) {
            padding-top: 25px !important;
          }
        }
      `}</style>
    </div>
  );
}