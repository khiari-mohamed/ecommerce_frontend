"use client";
import React, { JSX, useEffect } from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store"; 
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/formattedPrice";
import ProductBrandAroma from "@/components/product/ProductBrandAroma";
import StarRating from "../../components/Common/StarRating";
import { getProductImageSrc } from "@/utils/image";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

interface SingleGridItemProps {
  item: Product;
  rating: number;
  reviewsCount: number;
}

const SingleGridItem = ({ item, rating, reviewsCount }: SingleGridItemProps) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("Product:", item.designation, "cover:", item.cover);
  }, [item.designation, item.cover]);

  function normalizeImageUrl(url?: string): string {
    if (!url || typeof url !== "string" || url.trim() === "") return "/placeholder.svg";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return url;
    return "/" + url;
  }

  // Helper to get all normalized image URLs for thumbnails/previews
  const getAllImageUrls = () => {
    // Prefer cover, then mainImage, then others
    const main = normalizeImageUrl(item.cover || item.mainImage?.url);
    const others = (item.images || [])
      .map(img => normalizeImageUrl(img.url))
      .filter(url => url !== main); // avoid duplicate
    return [main, ...others];
  };

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    const allImgs = getAllImageUrls();
    dispatch(updateQuickView({ 
      ...item,
      title: item.designation || item.designation_fr || item.title || "",
      discountedPrice: item.price,
      price: item.oldPrice || item.price,
      imgs: {
        thumbnails: allImgs,
        previews: allImgs
      },
      reviews: item.reviews?.length || 0
    }));
  };

  // add to cart
  const handleAddToCart = () => {
    const mainImg = normalizeImageUrl(item.mainImage?.url);
    dispatch(
      addItemToCart({
        ...item,
         id: String(item.id ?? item._id ?? ""),
        quantity: 1,
        title: item.designation,
        discountedPrice: item.price,
        price: item.oldPrice || item.price,
        imgs: {
          thumbnails: [mainImg],
          previews: [mainImg]
        },
        image: ""
      })
    );
  };

  const handleItemToWishList = () => {
    const mainImg = normalizeImageUrl(item.mainImage?.url);
    dispatch(
      addItemToWishlist({
        ...item,
        id: String(item.id),
        status: "available",
        quantity: 1,
        title: item.designation,
        discountedPrice: item.price,
        price: item.oldPrice || item.price,
        imgs: {
          thumbnails: [mainImg],
          previews: [mainImg]
        }
      })
    );
  };

  
  return (
    <div>
      <Card
      className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white"
      style={{
      border: '1.5px solid #fff',
      transition: 'border-color 0.3s, border-width 0.3s',
      }}
      onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = '#ff6600';
      (e.currentTarget as HTMLDivElement).style.borderWidth = '2px';
      }}
      onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = '#fff';
      (e.currentTarget as HTMLDivElement).style.borderWidth = '1.5px';
      }}
      >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {(
          (typeof item.oldPrice === 'number' && typeof item.price === 'number' && item.oldPrice > item.price) ||
          (typeof item.price === 'number' && typeof item.discountedPrice === 'number' && item.price > item.discountedPrice)
        ) && (
          <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)', minWidth: 48, textAlign: 'center', padding: '0.25rem 0.5rem', display: 'inline-block' }} className="text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            -{
              typeof item.oldPrice === 'number' && typeof item.price === 'number' && item.oldPrice > item.price
                ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
                : Math.round(((item.price - item.discountedPrice) / item.price) * 100)
            }%
          </Badge>
        )}
      </div>
      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); handleItemToWishList(); }}>
      <Heart className="w-4 h-4 text-orange-500" />
      </Button>
      <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); openModal(); handleQuickViewUpdate(); }}>
      <Eye className="w-4 h-4 text-orange-500" />
      </Button>
      </div>
      <CardContent className="flex flex-col h-full p-4">
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
      <Image
      src={getProductImageSrc(item)}
      alt={item.designation || item.title || "Product image"}
      width={250}
      height={250}
      className="w-full h-full object-cover"
      priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {/* Product Info */}
      <div className="flex-grow flex flex-col">
      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
      <Link href={`/shop/${item.slug}`}>{item.designation}</Link>
      </h3>
      {/* Stars and Reviews */}
      <div className="flex items-center gap-2.5 justify-center mb-2">
        <StarRating rating={rating} />
        <span className="text-xs text-gray-500">({reviewsCount} avis)</span>
      </div>
      {/* Price */}
      <div className="flex items-center gap-2 mb-4 justify-center">
      <span style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 700, fontSize: '1.25rem' }}>
      {formatCurrency(item.price)}
      </span>
      {item.oldPrice && (
      <span className="text-sm text-gray-500 line-through">
      {formatCurrency(item.oldPrice)}
      </span>
      )}
      </div>
      </div>
      {/* Add to Cart Button */}
      <Button className="w-full font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }} onClick={e => { e.preventDefault(); handleAddToCart(); }}>
      <ShoppingCart className="w-4 h-4 mr-2 text-white" />
      Ajouter au panier
      </Button>
      </CardContent>
      </Card>
    </div>
  );
};

export default SingleGridItem;
