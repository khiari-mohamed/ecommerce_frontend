"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTopPromotions } from "@/services/top-promotion";
import type { TopPromotion } from "@/types/top-promotion";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

const TopPromotionSection = () => {
  const [promotions, setPromotions] = useState<TopPromotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopPromotions()
      .then((data) => {
        setPromotions(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper to get the image URL from the cover field
  const getImageUrl = (promo: TopPromotion) => {
    if (promo.product && promo.product.cover) {
      // Remove any leading slashes and use relative path
      const coverPath = promo.product.cover.startsWith('/')
        ? promo.product.cover.slice(1)
        : promo.product.cover;
      return `/produits/${coverPath.split('/').slice(1).join('/')}`;
    }
    return "/images/placeholder.png";
  };

  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // Normalize product for cart/preview/wishlist
  const normalizeProduct = (promo: TopPromotion) => {
    const product = promo.product || {};
    const imageUrl = getImageUrl(promo);
    return {
      ...product,
      // Fallbacks from promo if missing in product
      price: product.price ?? promo.prix ?? 0,
      discountedPrice: product.discountedPrice ?? promo.promo ?? product.price ?? promo.prix ?? 0,
      title: product.title ?? product.designation ?? promo.designation_fr ?? "Produit",
      designation: product.designation ?? promo.designation_fr ?? product.title ?? "Produit",
      cover: product.cover ?? promo.cover ?? imageUrl,
      imgs: product.imgs ?? { thumbnails: [imageUrl], previews: [imageUrl] },
      mainImage: product.mainImage ?? { url: imageUrl },
      images: product.images ?? [{ url: imageUrl }],
      _id: product._id ?? promo.productId ?? promo._id,
    };
  };

  // Handlers for promo.product
  const handleQuickViewUpdate = (promo: TopPromotion) => {
    dispatch(updateQuickView(normalizeProduct(promo)));
  };
  const handleAddToCart = (promo: TopPromotion) => {
    const normalized = normalizeProduct(promo);
    const stringId = String(
      normalized._id ||
      normalized.productId ||
      normalized.id ||
      promo._id ||
      promo.productId ||
      `${Date.now()}-${Math.random()}`
    );
    dispatch(addItemToCart({ ...normalized, id: stringId, quantity: 1, image: normalized.cover }));
  };
  const handleItemToWishList = (promo: TopPromotion) => {
    dispatch(addItemToWishlist({ ...normalizeProduct(promo), status: "available", quantity: 1 }));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-6 shadow-lg">
            <span className="text-2xl">🎉</span>
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'rgb(255, 69, 0)' }}>
              Top Promos
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Profitez de nos meilleures offres du moment sur une sélection de produits !
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center items-center py-10">
              <span>Chargement...</span>
            </div>
          ) : (
            promotions.slice(1, 5).map((promo, key) => (
              <Card
                key={promo._id || key}
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
                  {promo.prix > promo.promo && (
                    <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }} className="text-xs font-bold px-2 py-1">
                      -{Math.round(((promo.prix - promo.promo) / promo.prix) * 100)}%
                    </Badge>
                  )}
                  <Badge style={{ background: '#1cac54', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(28,172,84,0.15)' }} className="text-xs font-bold px-2 py-1 mt-1">
                    New
                  </Badge>
                </div>
                {/* Action buttons */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); handleItemToWishList(promo); }}>
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); handleQuickViewUpdate(promo); openModal(); }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="flex flex-col h-full p-4">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={getImageUrl(promo)}
                      alt={promo.designation_fr}
                      fill
                      className="w-full h-full object-cover"
                      loading="lazy"
                      sizes="100vw"
                    />
                    {/* Overlay gradient removed on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300" />
                  </div>
                  {/* Product Info */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
                      <Link href={`/product-details?id=${normalizeProduct(promo)._id}`}>{normalizeProduct(promo).title || normalizeProduct(promo).designation || promo.designation_fr || "Produit"}</Link>
                    </h3>
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4 justify-center">
                      <span style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 700, fontSize: '1.25rem' }}>
                        {Number(promo.promo).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {Number(promo.prix).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                      </span>
                    </div>
                  </div>
                  {/* Add to Cart Button */}
                  <Button className="w-full font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }} onClick={e => { e.preventDefault(); handleAddToCart(promo); }}>
                    <ShoppingCart className="w-4 h-4 mr-2 text-white" />
                    Ajouter au panier
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="text-center mt-8 sm:mt-12.5">
          <Link
            href="/promotions"
            className="inline-flex font-medium text-custom-sm py-3 px-5 sm:px-7 md:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 w-full sm:w-auto text-center justify-center promo-gradient-hover"
          >
            Voir toutes les promos
          </Link>
        <style>{`
          .promo-gradient-hover:hover {
            background: linear-gradient(90deg, #ea580c 0%, #f59e42 100%) !important;
            color: #fff !important;
            border-color: transparent !important;
          }
        `}</style>
        </div>
      </div>
    </section>
  );
};

export default TopPromotionSection;


