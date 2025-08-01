"use client";
import React from "react";
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
import StarRating from "@/components/Common/StarRating";
import { getProductImageSrc } from "@/utils/image";
import { Button } from '@/components/ui/button';
import { Heart, Eye, ShoppingCart } from 'lucide-react';

interface SingleListItemProps {
  item: Product;
  rating: number;
  reviewsCount: number;
}

const SingleListItem = ({ item, rating, reviewsCount }: SingleListItemProps) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  
  // update the QuickView state
  const handleQuickViewUpdate = () => {
    // Normalize image URLs similar to SingleGridItem
    function normalizeImageUrl(url?: string): string {
      if (!url || typeof url !== "string" || url.trim() === "") return "/placeholder.svg";
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      if (url.startsWith("/")) return url;
      return "/" + url;
    }
    const main = normalizeImageUrl(item.mainImage?.url || item.cover);
    const others = (item.images || [])
      .map(img => normalizeImageUrl(img.url))
      .filter(url => url !== main);
    const allImgs = [main, ...others];
    dispatch(updateQuickView({
      ...item,
      title: item.designation,
      discountedPrice: item.price,
      price: item.oldPrice || item.price,
      cover: item.cover,
      imgs: {
        thumbnails: allImgs,
        previews: allImgs
      },
      reviews: item.reviews?.length || 0
    }));
  };

  // add to cart
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
        status: "available",
        quantity: 1,
      })
    );
  };

  return (
    <div className="group rounded-lg bg-white shadow-1">
      <div className="flex">
        <div className="shadow-list relative overflow-hidden flex items-center justify-center max-w-[270px] w-full min-h-[180px] aspect-square p-4">
          <Image
            src={getProductImageSrc(item)}
            alt={item.designation || item.title || "Product image"}
            width={250}
            height={250}
            className="w-full h-full object-contain"
            priority={false}
          />
          {/* Action buttons overlay */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); handleItemToWishList(); }}>
              <Heart className="w-4 h-4 text-orange-500" />
            </Button>
            <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); openModal(); handleQuickViewUpdate(); }}>
              <Eye className="w-4 h-4 text-orange-500" />
            </Button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center justify-center sm:justify-between py-5 px-4 sm:px-7.5 lg:pl-11 lg:pr-12">
          <div className="flex-1 min-w-0">
            {/* Brand and Aromas */}
            <ProductBrandAroma brandId={item.brand?.['_id'] || item.brand || ""} />
            <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
              <Link href={`/product-details?id=${item._id || item.id}`}>{item.designation}</Link>
            </h3>
            {/* Stars and Reviews */}
            <div className="flex items-center gap-2.5 mb-2">
              <StarRating rating={rating} />
              <span className="text-xs text-gray-500">({reviewsCount} avis)</span>
            </div>
            <span className="flex items-center gap-2 font-medium text-lg">
              <span className="text-dark">{formatCurrency(item.discountedPrice ?? item.price)}</span>
              {item.oldPrice && (
                <span className="text-dark-4 line-through">{formatCurrency(item.oldPrice)}</span>
              )}
            </span>
          </div>
          {/* Add to Cart Button */}
          <div className="flex items-center">
            <Button className="font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }} onClick={e => { e.preventDefault(); handleAddToCart(); }}>
              <ShoppingCart className="w-4 h-4 mr-2 text-white" />
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
