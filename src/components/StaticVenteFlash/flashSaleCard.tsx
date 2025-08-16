"use client";
import { useState } from "react";
import { storage } from "./const/url";
import Image from "next/image";
import Link from "next/link";
import ReviewForm from "../ProductDetails/ReviewForm";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";

function FlashSaleCard({ product }: { product: any }) {
  const [showReview, setShowReview] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModalContext();
  const productPromoPercentage = Math.ceil(
    ((product.prix - product.promo) / product.prix) * 100
  );

  // Helper to get image URL
  const getImageUrl = () => {
    if (product.cover) {
      return product.cover.startsWith("http") ? product.cover : storage + product.cover;
    }
    return "/images/placeholder.png";
  };

  // Stable fake review count based on product id
  function getFakeReviewCount(id: string | number): number {
    const str = String(id);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i);
    }
    return (hash % 90) + 10;
  }

  // Add to wishlist
  const handleWishlist = (e: any) => {
    e.preventDefault();
    dispatch(
      addItemToWishlist({
        ...product,
        id: typeof product._id === "string" ? Number(product._id) : product._id ?? product.id,
        title: product.designation_fr || product.designation || product.title || "Produit",
        price: product.prix,
        discountedPrice: product.promo ?? product.prix,
        quantity: 1,
        status: "available",
      })
    );
  };

  // Quick view
  const handleEye = (e: any) => {
    e.preventDefault();
    dispatch(updateQuickView({
      ...product,
      id: typeof product._id === "string" ? Number(product._id) : product._id ?? product.id,
      title: product.designation_fr || product.designation || product.title || "Produit",
      price: product.prix,
      discountedPrice: product.promo ?? product.prix,
    }));
    openModal();
  };

  // Add to cart
  const handleAddToCart = (e: any) => {
    e.preventDefault();
    const stringId = String(
      product._id ||
      product.id ||
      `${Date.now()}-${Math.random()}`
    );
    dispatch(
      addItemToCart({
        ...product,
        id: stringId,
        title: product.designation_fr || product.designation || product.title || "Produit",
        price: product.prix,
        discountedPrice: product.promo ?? product.prix,
        quantity: 1,
        image: getImageUrl(),
        imgs: product.imgs ?? { thumbnails: [getImageUrl()], previews: [getImageUrl()] },
      })
    );
  };

  return (
    <Card
      className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white border-0 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 rounded-lg"
      role="article"
      aria-label={`Produit: ${product.designation_fr || "Produit"}`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.prix > product.promo && (
          <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }} className="text-xs font-bold px-2 py-1">
            -{productPromoPercentage}%
          </Badge>
        )}
        <Badge style={{ background: '#ff6b35', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(255,107,53,0.15)' }} className="text-xs font-bold px-2 py-1 mt-1">
          Flash
        </Badge>
      </div>
      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
        <Button 
          size="sm" 
          variant="ghost" 
          className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full focus:ring-2 focus:ring-orange-500 focus:ring-offset-2" 
          onClick={handleWishlist}
          aria-label={`Ajouter ${product.designation_fr || "ce produit"} à la liste de souhaits`}
        >
          <Heart className="w-4 h-4" aria-hidden="true" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full focus:ring-2 focus:ring-orange-500 focus:ring-offset-2" 
          onClick={handleEye}
          aria-label={`Aperçu rapide de ${product.designation_fr || "ce produit"}`}
        >
          <Eye className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
      <CardContent className="flex flex-col h-full p-4">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <Link 
            href={`/shop/${product.slug}`}
            className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
            aria-label={`Voir les détails de ${product.designation_fr || "ce produit"}`}
          >
            <Image
              src={getImageUrl()}
              alt={`Image de ${product.designation_fr || "produit flash"}`}
              fill
              className="w-full h-full object-contain"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300" />
        </div>
        {/* Product Info */}
        <div className="flex-grow flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
            <Link 
              href={`/shop/${product.slug}`}
              className="focus:outline-none focus:underline focus:text-orange-600"
              aria-label={`Voir les détails de ${product.designation_fr || "ce produit"}`}
            >
              {product.designation_fr || "Produit"}
            </Link>
          </h3>
          {/* Reviews */}
          <div className="flex items-center justify-center mb-2" role="group" aria-label="Évaluation du produit">
            <div className="flex" role="img" aria-label="5 étoiles sur 5">
              {[...Array(5)].map((_, i) => (
                <Image key={i} src="/images/icons/icon-star.svg" alt="" width={14} height={14} loading="lazy" sizes="14px" aria-hidden="true" />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1" aria-label={`${getFakeReviewCount(product._id || product.id)} avis`}>
              ({getFakeReviewCount(product._id || product.id)})
            </span>
          </div>
          {/* Price */}
          <div className="flex flex-col items-center gap-1 mb-3 justify-center" role="group" aria-label="Prix du produit">
            <span 
              className="text-sm sm:text-lg font-bold text-center" 
              style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}
              aria-label={`Prix actuel: ${Number(product.promo).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`}
            >
              {Number(product.promo).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
            </span>
            <span 
              className="text-xs sm:text-sm text-gray-500 line-through text-center"
              aria-label={`Prix original: ${Number(product.prix).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`}
            >
              {Number(product.prix).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
            </span>
          </div>
        </div>
        {/* Add to Cart Button */}
        <Button 
          className="w-full font-medium py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm" 
          style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600 }} 
          onClick={handleAddToCart}
          aria-label={`Ajouter ${product.designation_fr || "ce produit"} au panier`}
        >
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-white" aria-hidden="true" />
          <span className="hidden sm:inline">Ajouter au panier</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      </CardContent>
      {/* Review Popup */}
      {showReview && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black bg-opacity-40 overflow-y-auto pt-8 pb-8">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[95vw] sm:max-w-[400px] p-4 relative max-h-[70vh] overflow-y-auto mx-2 mt-16 md:mt-0">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
              onClick={() => setShowReview(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <ReviewForm productId={String(product.id || product._id || "")}/>
          </div>
        </div>
      )}
    </Card>
  );
}

export default FlashSaleCard;
