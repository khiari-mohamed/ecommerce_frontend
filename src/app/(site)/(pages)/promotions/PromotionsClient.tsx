"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "@/lib/axios";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Breadcrumb from "@/components/Common/Breadcrumb";

interface ProductItem {
  _id?: string;
  id?: string;
  price?: number;
  prix?: number;
  discountedPrice?: number;
  promo?: number;
  cover?: string;
  title?: string;
  designation_fr?: string;
  designation?: string;
  mainImage?: { url: string };
  images?: { url: string }[];
  imgs?: { thumbnails: string[]; previews: string[] };
  [key: string]: any;
}

const PromotionsClient = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // Robust normalization logic
  function normalizeProduct(item: ProductItem) {
    return {
      ...item,
      imgs: item.imgs && item.imgs.thumbnails?.length > 0 && item.imgs.previews?.length > 0
        ? item.imgs
        : {
            thumbnails: (
              item.images && Array.isArray(item.images) && item.images.length > 0
                ? item.images.map((img) => img.url)
                : item.mainImage?.url
                ? [item.mainImage.url]
                : []
            ),
            previews: (
              item.images && Array.isArray(item.images) && item.images.length > 0
                ? item.images.map((img) => img.url)
                : item.mainImage?.url
                ? [item.mainImage.url]
                : []
            ),
          },
      mainImage: item.mainImage || { url: item.cover || "" },
      cover: item.cover || item.mainImage?.url || "",
    };
  }

  // Helper to get the image URL
  const getImageUrl = (item: ProductItem) => {
    if (item.cover) {
      const coverPath = item.cover.startsWith('/') ? item.cover.slice(1) : item.cover;
      return `/produits/${coverPath.split('/').slice(1).join('/')}`;
    }
    return "/images/placeholder.png";
  };

  // Enhanced image URL with backend fallback for new images
  const getEnhancedImageUrl = (item: ProductItem) => {
    if (!item.cover) return "/images/placeholder.png";
    
    // Check if this is a NEW backend-served image (contains August2025 pattern)
    if (item.cover.includes('August2025')) {
      const backendUrl = 'https://145.223.118.9:5000';
      return `${backendUrl}${item.cover}`;
    }
    
    // For old images, use the original logic
    return getImageUrl(item);
  };

  // Handlers
  const handleQuickViewUpdate = (item: ProductItem) => {
    dispatch(updateQuickView(normalizeProduct(item)));
  };
  const handleAddToCart = (item: ProductItem) => {
    const normalized = normalizeProduct(item);
    const stringId = String(normalized._id || normalized.id || `${Date.now()}-${Math.random()}`);
    dispatch(addItemToCart({ 
      ...normalized, 
      id: stringId, 
      quantity: 1, 
      image: getImageUrl(item),
      title: normalized.title || normalized.designation_fr || normalized.designation || "Produit",
      price: normalized.price || normalized.prix || 0,
      discountedPrice: normalized.discountedPrice || normalized.promo || 0
    }));
  };
  const handleItemToWishList = (item: ProductItem) => {
    const normalized = normalizeProduct(item);
    dispatch(addItemToWishlist({ 
      ...normalized, 
      id: String(normalized._id || normalized.id || `${Date.now()}-${Math.random()}`),
      title: normalized.title || normalized.designation_fr || normalized.designation || "Produit",
      price: normalized.price || normalized.prix || 0,
      discountedPrice: normalized.discountedPrice || normalized.promo || 0,
      status: "available", 
      quantity: 1 
    }));
  };

  useEffect(() => {
    axios.get("/products/store/promotions")
      .then(res => {
        const mapped = (res.data.data || []).map((item) => {
          const normalized = normalizeProduct({
            ...item,
            price: Number(item.prix ?? item.price) || 0,
            discountedPrice: Number(item.promo ?? item.discountedPrice) || Number(item.prix ?? item.price) || 0,
            cover: item.cover || item.mainImage?.url || "",
            title: item.designation_fr || item.designation || "",
          });
          return normalized;
        });
        setProducts(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  return (
    <div className="promotions-page">
      <Breadcrumb title={"Promotions"} pages={["promotions"]} />
      <section className="pt-4 pb-20 bg-gradient-to-b from-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center items-center py-10">
              <span>Chargement...</span>
            </div>
          ) : (
            currentProducts.map((item, key) => (
              <Card
                key={item._id || key}
                className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white border-0"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {(item.price || item.prix || 0) > (item.discountedPrice || item.promo || 0) && (item.price || item.prix) && (
                    <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }} className="text-xs font-bold px-2 py-1">
                      -{Math.round((((item.price || item.prix || 0) - (item.discountedPrice || item.promo || 0)) / (item.price || item.prix || 1)) * 100)}%
                    </Badge>
                  )}
                  <Badge style={{ background: '#1cac54', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(28,172,84,0.15)' }} className="text-xs font-bold px-2 py-1 mt-1">
                    New
                  </Badge>
                </div>
                {/* Action buttons */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); handleItemToWishList(item); }}>
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); handleQuickViewUpdate(item); openModal(); }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="flex flex-col h-full p-4">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={getEnhancedImageUrl(item)}
                      alt={item.designation_fr || item.title || "Produit"}
                      fill
                      className="w-full h-full object-cover"
                      loading="lazy"
                      sizes="100vw"
                      unoptimized={item.cover?.includes('August2025')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300" />
                  </div>
                  {/* Product Info */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
                      <Link href={`/shop/${item.slug || item._id || item.id || 'product'}`}>{normalizeProduct(item).title || normalizeProduct(item).designation || item.designation_fr || "Produit"}</Link>
                    </h3>
                    {/* Stars */}
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Image key={i} src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} loading="lazy" sizes="14px" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({((key + 1) * 13 % 90) + 10})</span>
                    </div>
                    {/* Price */}
                    <div className="flex flex-col items-center gap-1 mb-3 justify-center">
                      <span className="text-sm sm:text-lg font-bold text-center" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        {Number(item.discountedPrice || item.promo || item.price || item.prix).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through text-center">
                        {Number(item.price || item.prix).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                      </span>
                    </div>
                  </div>
                  {/* Add to Cart Button */}
                  <Button className="w-full font-medium py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-xs sm:text-sm" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600 }} onClick={e => { e.preventDefault(); handleAddToCart(item); }}>
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-white" />
                    <span className="hidden sm:inline">Ajouter au panier</span>
                    <span className="sm:hidden">Ajouter</span>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-15">
            <div className="bg-white shadow-1 rounded-md p-2">
              <ul className="flex items-center">
                {/* Previous Button */}
                <li>
                  <button
                    aria-label="button for pagination left"
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4 hover:text-white hover:bg-blue"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </li>
                {/* Page Numbers */}
                {(() => {
                  const pages: React.ReactElement[] = [];
                  const maxPageButtons = 5;
                  let startPage = Math.max(1, currentPage - 2);
                  let endPage = Math.min(totalPages, currentPage + 2);

                  if (currentPage <= 3) {
                    endPage = Math.min(totalPages, maxPageButtons);
                  } else if (currentPage >= totalPages - 2) {
                    startPage = Math.max(1, totalPages - maxPageButtons + 1);
                  }

                  // First page
                  if (startPage > 1) {
                    pages.push(
                      <li key={1}>
                        <button
                          onClick={() => setCurrentPage(1)}
                          className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                            currentPage === 1 ? "bg-blue text-white" : "hover:text-white hover:bg-blue"
                          }`}
                          disabled={currentPage === 1}
                        >
                          1
                        </button>
                      </li>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <li key="start-ellipsis">
                          <span className="flex py-1.5 px-3.5">...</span>
                        </li>
                      );
                    }
                  }

                  // Middle pages
                  for (let i = startPage; i <= endPage; i++) {
                    if (i === 1 || i === totalPages) continue;
                    pages.push(
                      <li key={i}>
                        <button
                          onClick={() => setCurrentPage(i)}
                          className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                            currentPage === i ? "bg-blue text-white" : "hover:text-white hover:bg-blue"
                          }`}
                          disabled={currentPage === i}
                        >
                          {i}
                        </button>
                      </li>
                    );
                  }

                  // Last page
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <li key="end-ellipsis">
                          <span className="flex py-1.5 px-3.5">...</span>
                        </li>
                      );
                    }
                    pages.push(
                      <li key={totalPages}>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                            currentPage === totalPages ? "bg-blue text-white" : "hover:text-white hover:bg-blue"
                          }`}
                          disabled={currentPage === totalPages}
                        >
                          {totalPages}
                        </button>
                      </li>
                    );
                  }

                  return pages;
                })()}
                {/* Next Button */}
                <li>
                  <button
                    aria-label="button for pagination right"
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
    </div>
  );
};

export default PromotionsClient;