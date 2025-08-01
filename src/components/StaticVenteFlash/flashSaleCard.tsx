"use client";
import { useState } from "react";
import { storage } from "./const/url";
import Image from "next/image";
import Link from "next/link";
import Star from "./stars";
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
  const [rating, setRating] = useState(0); // Always start with no stars selected
  const [showReview, setShowReview] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModalContext();
  const productPromoPercentage = Math.ceil(
    ((product.prix - product.promo) / product.prix) * 100
  );

  // Function to handle star click
  const handleStarClick = (newRating: number) => {
    setRating(newRating);
    setShowReview(true);
  };

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

  // Quick view (review popup)
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
    setShowReview(true);
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
        image: product.cover ? (product.cover.startsWith("http") ? product.cover : storage + product.cover) : "",
        imgs: product.imgs ?? { thumbnails: [product.cover], previews: [product.cover] },
      })
    );
  };

  return (
    <Card
      className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white"
      style={{
        border: '1.5px solid #fff',
        transition: 'border-color 0.3s, border-width 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#ff6600';
        e.currentTarget.style.borderWidth = '2px';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#fff';
        e.currentTarget.style.borderWidth = '1.5px';
      }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {productPromoPercentage && (
          <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }} className="text-xs font-bold px-2 py-1">
            -{productPromoPercentage}%
          </Badge>
        )}
        <Badge style={{ background: '#1cac54', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(28,172,84,0.15)' }} className="text-xs font-bold px-2 py-1 mt-1">
          Flash
        </Badge>
      </div>
      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={handleWishlist}>
          <Heart className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={handleEye}>
          <Eye className="w-4 h-4" />
        </Button>
      </div>
      <CardContent className="flex flex-col h-full p-4">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          <Link href={`/shop/${product.slug}`}>
            <Image
              fill
              alt={product.alt_cover || product.designation_fr}
              src={
                product.cover
                  ? product.cover.startsWith("http")
                    ? product.cover
                    : storage + product.cover
                  : "/public/img/product/p1.webp"
              }
              className="object-contain"
            />
          </Link>
          {/* No overlay on hover, keep clean like promo section */}
        </div>
        {/* Product Info */}
        <div className="flex-grow flex flex-col">
          <Link href={`/shop/${product.slug}`} className="displaylink">
            <h1 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
              {product.designation_fr}
            </h1>
          </Link>
          {/* Stars for review */}
          <span className="flex items-center gap-0.5 mb-4 justify-center">
            {[1, 2, 3, 4, 5].map((star, i) => {
              const isFilled = i < rating;
              return (
                <Star
                  key={i}
                  fill={isFilled ? "#EAB308" : "none"}
                  onClick={() => handleStarClick(i + 1)}
                  className="cursor-pointer"
                />
              );
            })}
          </span>
          {/* Price */}
          {product.promo ? (
            <div className="flex flex-row items-center gap-2 mb-4 justify-center">
              <span style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 700, fontSize: '1.25rem' }}>{product.promo} DT</span>
              <span className="text-sm text-gray-500 line-through">{product.prix} DT</span>
            </div>
          ) : (
            <span className="text-orange-600 font-bold text-xl mb-4 block text-center">{product.prix} DT</span>
          )}
        </div>
        {/* Add to Cart Button */}
        <Button className="w-full font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }} onClick={handleAddToCart}>
          <ShoppingCart className="w-4 h-4 mr-2 text-white" />
          Ajouter au panier
        </Button>
      </CardContent>
      {/* Review Popup */}
      {showReview && (
      <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black bg-opacity-40 overflow-y-auto pt-8 pb-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[95vw] sm:max-w-[400px] p-4 relative max-h-[70vh] overflow-y-auto mx-2 mt-16 md:mt-0">
      <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
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
