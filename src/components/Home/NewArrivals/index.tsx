"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getNewProductsFeature } from "@/services/products";
import type { Product } from "@/types/product";
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

const NewArrival = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get products and config from backend
        const data = await getNewProductsFeature();
        setProducts(data.products || []);
        setConfig(data.config || {
          sectionTitle: "Nouveautés",
          sectionDescription: "Découvrez nos nouveaux produits fraîchement arrivés !",
          maxDisplay: 100,
          showOnFrontend: true
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
        setConfig({});
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Listen for storage changes to refresh when dashboard updates
    const handleStorageChange = () => {
      fetchData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Helper to get the image URL from the product
  const getImageUrl = (item: Product) => {
    let src =
      (item.cover && typeof item.cover === 'string' && item.cover.trim() !== '') ? item.cover :
      item.imgs?.previews?.[0] ? item.imgs.previews[0] :
      item.imgs?.thumbnails?.[0] ? item.imgs.thumbnails[0] :
      (item.mainImage && typeof item.mainImage === "object" && item.mainImage.url) ? item.mainImage.url :
      (Array.isArray(item.images) && item.images.length > 0 && item.images[0]?.url) ? item.images[0].url :
      "/images/placeholder.png";
    // Ensure leading slash for relative paths
    if (src && typeof src === 'string' && !src.startsWith('/') && !src.startsWith('http')) {
      src = '/' + src;
    }
    return src;
  };

  // Normalize product for cart/preview/wishlist
  const normalizeProduct = (item: Product) => {
    const imageUrl = getImageUrl(item);
    return {
      ...item,
      id: typeof item._id === "string" ? Number(item._id) : item._id ?? item.id,
      imgs: item.imgs && item.imgs.thumbnails.length > 0 && item.imgs.previews.length > 0
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
      cover: item.cover ?? imageUrl,
      mainImage: item.mainImage ?? { url: imageUrl },
      images: item.images ?? [{ url: imageUrl }],
    };
  };

  // Handlers
  const handleQuickViewUpdate = (item: Product) => {
    dispatch(updateQuickView(normalizeProduct(item)));
  };
  const handleAddToCart = (item: Product) => {
    const normalized = normalizeProduct(item);
    const stringId = String(
      normalized._id ||
      normalized.id ||
      item._id ||
      item.id ||
      `${Date.now()}-${Math.random()}`
    );
    dispatch(addItemToCart({ ...normalized, id: stringId, quantity: 1, image: normalized.cover }));
  };
  const handleItemToWishList = (item: Product) => {
    const normalized = normalizeProduct(item);
    dispatch(addItemToWishlist({ ...normalized, id: String(normalized.id), status: "available", quantity: 1 }));
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

  // Don't render if showOnFrontend is false
  if (config?.showOnFrontend === false) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-yellow-50" aria-labelledby="new-arrivals-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-6 shadow-lg">
            <span className="text-2xl">🆕</span>
          </div>
          <div className="text-center">
            <h2 id="new-arrivals-title" className="text-4xl font-bold mb-4" style={{ color: 'rgb(255, 69, 0)' }}>
              {config?.sectionTitle || 'Nouveautés'}
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {config?.sectionDescription || 'Découvrez nos nouveaux produits fraîchement arrivés !'}
          </p>
        </div>
        <div className={`grid gap-8 ${
          products.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          products.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
          products.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' :
          products.length <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
          products.length <= 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {loading ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center items-center py-10" role="status" aria-live="polite">
              <span>Chargement...</span>
            </div>
          ) : (
            products.slice(0, config?.maxDisplay || 100).map((item, key) => {
              const normalized = normalizeProduct(item);
              return (
                <Card
                  key={normalized.id || key}
                  className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white border-0 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 rounded-lg"
                  role="article"
                  aria-label={`Produit: ${normalized.title || normalized.designation || "Produit"}`}
                >
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {normalized.price > normalized.discountedPrice && (
                      <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }} className="text-xs font-bold px-2 py-1">
                        -{Math.round(((normalized.price - normalized.discountedPrice) / normalized.price) * 100)}%
                      </Badge>
                    )}
                    <Badge style={{ background: '#1cac54', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(28,172,84,0.15)' }} className="text-xs font-bold px-2 py-1 mt-1">
                      New
                    </Badge>
                  </div>
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full focus:ring-2 focus:ring-orange-500 focus:ring-offset-2" 
                      onClick={e => { e.preventDefault(); handleItemToWishList(item); }}
                      aria-label={`Ajouter ${normalized.title || normalized.designation || "ce produit"} à la liste de souhaits`}
                    >
                      <Heart className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full focus:ring-2 focus:ring-orange-500 focus:ring-offset-2" 
                      onClick={e => { e.preventDefault(); handleQuickViewUpdate(item); openModal(); }}
                      aria-label={`Aperçu rapide de ${normalized.title || normalized.designation || "ce produit"}`}
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <CardContent className="flex flex-col h-full p-4">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <Link 
                        href={`/shop/${normalized.slug}`}
                        className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
                        aria-label={`Voir les détails de ${normalized.title || normalized.designation || "ce produit"}`}
                      >
                        <Image
                          src={getImageUrl(normalized)}
                          alt={`Image de ${normalized.title || normalized.designation || "produit"}`}
                          fill
                          className="w-full h-full object-contain"
                          loading="lazy"
                          sizes="100vw"
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300" />
                    </div>
                    {/* Product Info */}
                    <div className="flex-grow flex flex-col">
                      <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
                        <Link 
                          href={`/shop/${normalized.slug}`}
                          className="focus:outline-none focus:underline focus:text-orange-600"
                          aria-label={`Voir les détails de ${normalized.title || normalized.designation || "ce produit"}`}
                        >
                          {normalized.title || normalized.designation || "Produit"}
                        </Link>
                      </h3>
                      {/* Reviews */}
                      <div className="flex flex-row flex-nowrap items-center justify-center gap-2 mb-2" role="group" aria-label="Évaluation du produit">
                        <div className="flex flex-row flex-nowrap items-center gap-1">
                          <div className="flex" role="img" aria-label="5 étoiles sur 5">
                            {[...Array(5)].map((_, i) => (
                              <Image key={i} src="/images/icons/icon-star.svg" alt="" width={14} height={14} loading="lazy" sizes="14px" aria-hidden="true" />
                            ))}
                          </div>
                          <span className="text-custom-sm ml-1" aria-label={`${normalized.reviews?.length && normalized.reviews.length > 0 ? normalized.reviews.length : getFakeReviewCount(normalized._id || normalized.id)} avis`}>
                            {normalized.reviews?.length && normalized.reviews.length > 0
                              ? `(${normalized.reviews.length})`
                              : `(${getFakeReviewCount(normalized._id || normalized.id)})`}
                          </span>
                        </div>
                      </div>
                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4 justify-center" role="group" aria-label="Prix du produit">
                        <span 
                          style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 700, fontSize: '1.25rem' }}
                          aria-label={`Prix actuel: ${Number(normalized.discountedPrice ?? normalized.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`}
                        >
                          {Number(normalized.discountedPrice ?? normalized.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                        </span>
                        {normalized.discountedPrice && normalized.discountedPrice < normalized.price && (
                          <span 
                            className="text-sm text-gray-500 line-through"
                            aria-label={`Prix original: ${Number(normalized.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`}
                          >
                            {Number(normalized.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Add to Cart Button */}
                    <Button 
                      className="w-full font-medium py-3 rounded-lg shadow-lg hover:shadow-xl focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center" 
                      style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }} 
                      onClick={e => { e.preventDefault(); handleAddToCart(item); }}
                      aria-label={`Ajouter ${normalized.title || normalized.designation || "ce produit"} au panier`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2 text-white" aria-hidden="true" />
                      Ajouter au panier
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
        <div className="text-center mt-8 sm:mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-5 sm:px-7 md:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 w-full sm:w-auto text-center justify-center promo-gradient-hover focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none"
            aria-label="Voir tous les nouveaux produits"
          >
            Tout voir
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

export default NewArrival;
