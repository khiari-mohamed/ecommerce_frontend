"use client";
import React, { useRef } from "react";
import ProductItem from "@/components/Common/ProductItem";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getProductImage(product: any) {
  // Prefer mainImage.url, then cover, then fallback
  let img = product.mainImage?.url || product.cover;
  if (img) {
    // If already absolute, return as is
    if (img.startsWith("http")) return img;
    // Otherwise, build full URL
    return `${API_URL}/${img.replace(/^\/+/, "")}`;
  }
  return "/default-product.jpg";
}

export default function ProductSlider({ products }: { products: any[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  const showScrollButtons = products.length > 4;

  return (
    <div className="relative px-4 md:px-8">
      {/* Optional fade effect */}
      <div className="absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      {showScrollButtons && (
        <button
          aria-label="Scroll left"
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-blue-100 shadow-lg rounded-full p-2 border border-blue-200 transition-all"
        >
          <svg
            className="w-6 h-6 text-blue-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div
        ref={sliderRef}
        className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((item: any, key: number) => {
          // Robust image selection logic (same as BestSeller/ProductCard)
          function getProductImageSrc(item: any): string {
            if (typeof item.cover === "string" && item.cover.trim() !== "") return item.cover;
            if (item.imgs?.previews?.[0]) return item.imgs.previews[0];
            if (item.imgs?.thumbnails?.[0]) return item.imgs.thumbnails[0];
            if (item.mainImage && typeof item.mainImage === "object" && item.mainImage.url) return item.mainImage.url;
            if (Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.url) return item.images[0].url;
            return "/images/placeholder.png";
          }
          // Robust normalization logic (copied from ShopWithSidebar)
          const normalized = {
            ...item,
            imgs: item.imgs && item.imgs.thumbnails?.length > 0 && item.imgs.previews?.length > 0
              ? item.imgs
              : {
                  thumbnails: (
                    item.images && Array.isArray(item.images) && item.images.length > 0
                      ? item.images.map((img: any) => img.url)
                      : item.mainImage?.url
                      ? [item.mainImage.url]
                      : []
                  ),
                  previews: (
                    item.images && Array.isArray(item.images) && item.images.length > 0
                      ? item.images.map((img: any) => img.url)
                      : item.mainImage?.url
                      ? [item.mainImage.url]
                      : []
                  ),
                },
            mainImage: item.mainImage || { url: item.cover || "" },
            cover: item.cover || item.mainImage?.url || "",
            title: item.title || item.designation_fr || item.designation || "Produit",
            discountedPrice: item.price,
            reviews: item.reviews || 0,
            image: getProductImageSrc(item), // Add robust image property
          };
          return (
            <div
              key={item._id || item.id}
              className="min-w-[75vw] max-w-[95vw] sm:min-w-[320px] sm:max-w-[350px] min-h-[260px] sm:min-h-[360px] snap-start flex-shrink-0 transform hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 shadow-xl rounded-2xl bg-white/90 border border-blue-100 hover:shadow-2xl hover:border-blue-300"
              style={{
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
              }}
            >
              <ProductItem item={normalized} />
            </div>
          );
        })}
      </div>

      {showScrollButtons && (
        <button
          aria-label="Scroll right"
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-blue-100 shadow-lg rounded-full p-2 border border-blue-200 transition-all"
        >
          <svg
            className="w-6 h-6 text-blue-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
