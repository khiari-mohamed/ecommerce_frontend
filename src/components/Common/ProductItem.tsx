"use client";
// Extend window type to allow __lastProductItem for debugging
declare global {
  interface Window {
    __lastProductItem?: any;
  }
}
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { Aroma } from "@/types/aroma";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { ShoppingCart, Heart, Eye } from 'lucide-react';

interface ProductItemProps {
  item: Product;
  aromas?: Aroma[];
}

const ProductItem = ({ item, aromas: aromasProp = [] }: ProductItemProps) => {
  if (typeof window !== "undefined") {
    window.__lastProductItem = item;
    console.log("[ProductItem] item:", item);
  }
  const [aromas, setAromas] = React.useState<Aroma[]>(aromasProp);
  React.useEffect(() => {
    if (!aromasProp.length) {
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
    }
  }, [aromasProp]);
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };
  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        id: String(item.id ?? item._id ?? ""),
        quantity: 1,
        image: ""
      })
    );
  };
  const handleItemToWishList = () => {
    dispatch(
    addItemToWishlist({
    ...item,
    id: String(item.id),
    status: "available",
    quantity: 1,
    })
    );
  };
  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };
  const getValidImageSrc = (src?: string): string => {
    if (!src || typeof src !== "string" || src.trim() === "") {
      return "/images/placeholder.png";
    }
    let cleanSrc = src.trim().replace(/\\\\/g, "/").replace(/\\/g, "/");
    if (cleanSrc.startsWith("http://localhost") || cleanSrc.startsWith("https://localhost")) {
      const url = new URL(cleanSrc);
      cleanSrc = url.pathname;
    }
    if (cleanSrc.startsWith("http")) {
      return cleanSrc;
    }
    if (!cleanSrc.startsWith("/")) {
      cleanSrc = "/" + cleanSrc;
    }
    return cleanSrc;
  };
  const imageSrc = getValidImageSrc(
    item.cover ||
    item.imgs?.previews?.[0] || 
    item.imgs?.thumbnails?.[0] ||
    item.mainImage?.url
  );
  function getFakeReviewCount(id: string | number): number {
    const str = String(id);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i);
    }
    return (hash % 90) + 10;
  }

  return (
    <div
      className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white rounded-xl border-0"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {typeof item.price === 'number' && typeof item.discountedPrice === 'number' && item.price > item.discountedPrice && (
          <span
            style={{
              background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.75rem',
              boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)',
              zIndex: 20,
              position: 'relative',
              display: 'inline-block',
            }}
            className="text-xs font-bold px-2 py-1"
          >
            -{Math.round(((item.price - item.discountedPrice) / item.price) * 100)}%
          </span>
        )}
      </div>
      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={() => handleItemToWishList()} className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center">
          <Heart className="w-4 h-4 text-orange-500" />
        </button>
        <button onClick={() => { openModal(); handleQuickViewUpdate(); }} className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center">
          <Eye className="w-4 h-4 text-orange-500" />
        </button>
      </div>
      <div className="p-4 flex flex-col h-full">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <Image src={imageSrc} alt={item.title || item.designation || ""} width={250} height={250} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {/* Product Info */}
        <div className="flex-grow flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center" onClick={() => handleProductDetails()}>
            <Link href={`/shop/${item.slug}`}>{item.title || item.designation || item.designation_fr || "Produit"}</Link>
          </h3>
          {/* Price */}
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 700, fontSize: '1.25rem' }}>
              {Number(item.discountedPrice).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {Number(item.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
            </span>
          </div>
        </div>
        {/* Add to Cart Button */}
        <button className="w-full font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }} onClick={handleAddToCart}>
          <ShoppingCart className="w-4 h-4 mr-2 text-white" />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
