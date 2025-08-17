"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fetchMusculationProducts } from "@/services/Musculationproducts";
import { MusculationProduct } from "@/types/MusculationProducts";
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

interface Product {
  _id: string;
  designation: string;
  mainImage: { url: string };
  price: number;
  oldPrice?: number;
  inStock?: boolean;
  slug: string;
  brand?: string;
  reviews?: Array<{ rating: number }>;
  [key: string]: any;
}

function getFallbackImageByIndex(idx: number): string {
  return `/fallbacks/${(idx % 12) + 1}.png`;
}

const mapToProductCard = (product: MusculationProduct, idx: number): Product => ({
  ...product,
  _id: product._id,
  designation: product.designation_fr,
  mainImage: {
    url: product.cover
      ? product.cover.startsWith("/")
        ? product.cover
        : "/" + product.cover
      : getFallbackImageByIndex(idx)
  },
  price: Number(product.prix),
  oldPrice: product.promo ? Number(product.promo) : undefined,
  inStock: product.qte ? Number(product.qte) > 0 : undefined,
  slug: product.slug,
  brand: product.brand_id,
  reviews: [],
});

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: easeOut }
  }
};

const fadeFromLeftVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: easeOut }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, delay: 0.3, ease: easeOut }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

const images = [
  "/img/v2.jpg",
  "/img/v4.jpg",
  "/img/vv7.jpg",
];

const IMAGE_CHANGE_INTERVAL = 4000;
const FADE_DURATION = 1.2;

const MusculationProducts = () => {
  const [current, setCurrent] = useState(0);
  const [sampleProducts, setSampleProducts] = useState<MusculationProduct[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModalContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, IMAGE_CHANGE_INTERVAL);
    return () => clearTimeout(timeout);
  }, [current]);

  const [config, setConfig] = useState<any>({
    sectionTitle: "Matériel de Musculation",
    sectionDescription: "Découvrez notre gamme complète de matériel musculation, fitness et cardio pour équiper votre salle de sport.",
    maxDisplay: 4,
    showOnFrontend: true
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to get products with configuration from backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/products/store/materiel-de-musculation`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.products && data.products.length > 0) {
            setSampleProducts(data.products.slice(0, data.config?.maxDisplay || 4));
            if (data.config) {
              setConfig(data.config);
            }
            return;
          }
        }
        
        // Fallback: get products from musculation service
        const products = await fetchMusculationProducts();
        setSampleProducts(products.slice(10, 14));
      } catch (e) {
        setSampleProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Don't render if showOnFrontend is false
  if (config?.showOnFrontend === false) {
    return null;
  }

  // Helper to get the image URL from the product
  const getImageUrl = (item: Product) => {
    let src =
      (item.cover && typeof item.cover === 'string' && item.cover.trim() !== '') ? item.cover :
      item.mainImage?.url ? item.mainImage.url :
      "/images/placeholder.png";
    if (src && typeof src === 'string' && !src.startsWith('/') && !src.startsWith('http')) {
      src = '/' + src;
    }
    return src;
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

  // Handlers for product actions
  const handleAddToCart = useCallback(async (item: Product, e: any) => {
    e.preventDefault();
    if (isAddingToCart === item._id || !item.inStock) return;
    try {
      setIsAddingToCart(item._id);
      const stringId = String(
        item._id ||
        item.id ||
        `${Date.now()}-${Math.random()}`
      );
      dispatch(addItemToCart({
        ...item,
        id: stringId,
        title: item.designation,
        price: item.price,
        discountedPrice: item.oldPrice && item.oldPrice > item.price ? item.price : item.price,
        quantity: 1,
        imgs: item.mainImage ? { thumbnails: [item.mainImage.url], previews: [item.mainImage.url] } : undefined,
        type: "Product",
        image: getImageUrl(item),
        mainImage: item.mainImage,
        cover: item.cover || item.mainImage?.url || "",
        slug: item.slug,
        brand: item.brand,
        inStock: item.inStock,
      }));
    } finally {
      setIsAddingToCart(null);
    }
  }, [dispatch, isAddingToCart]);

  const handleItemToWishList = (item: Product, e: any) => {
    e.preventDefault();
    dispatch(addItemToWishlist({
      ...item, status: "available", quantity: 1,
      id: String(item._id || item.id || `${Date.now()}-${Math.random()}`),
      title: "",
      discountedPrice: 0
    }));
  };

  const handleQuickViewUpdate = (item: Product, e: any) => {
    e.preventDefault();
    dispatch(updateQuickView(item));
    openModal();
  };

  return (
    <div className="w-full mt-16 sm:mt-20 md:mt-24">
      {/* Section Header - transformed to match other sections */}
      <section className="w-full mx-auto max-w-screen-2xl" aria-labelledby="musculation-title">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-6 shadow-lg">
            <span className="text-2xl">🏋️♂️</span>
          </div>
          <div className="text-center">
            <h2 id="musculation-title" className="text-4xl font-bold mb-4" style={{ color: 'rgb(255, 69, 0)' }}>
              {config?.sectionTitle || "Matériel de Musculation"}
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {config?.sectionDescription || "Découvrez notre gamme complète de matériel musculation, fitness et cardio pour équiper votre salle de sport."}
          </p>
        </div>
      </section>

      {/* Banner Image Section (unchanged) */}
      <div className="relative w-full min-h-[220px] h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden flex items-center justify-center">
        <AnimatePresence>
          {images.map((src, idx) =>
            idx === current ? (
              <motion.div
                key={src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: 1 }}
              >
                <Image
                  src={src}
                  fill
                  priority
                  className="object-cover w-full h-full"
                  alt="Équipement de musculation et fitness"
                  sizes="100vw"
                />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40 z-10 flex items-center justify-center">
          <div className="w-full flex flex-col items-center sm:items-start justify-center px-2 sm:px-6 md:px-12 lg:px-24 py-4 sm:py-8 max-w-4xl">
            <motion.h2
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mb-2 text-lg sm:text-xl md:text-2xl lg:text-4xl font-extrabold text-center sm:text-left uppercase text-white"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              
            </motion.h2>
            <motion.p
              variants={fadeFromLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="max-w-full sm:max-w-2xl mb-2 sm:mb-4 text-xs sm:text-base md:text-lg text-center sm:text-left text-white"
            >
              Atteignez vos objectifs
              avec des équipements de qualité professionnelle, adaptés à tous
              les niveaux. Performance, endurance et force, tout commence ici !
            </motion.p>
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.5 }}
              className="w-full flex justify-center sm:justify-start"
            >
              <Link
                href="/musculation-products"
                className="musculation-savoir-plus-btn inline-flex font-medium text-white text-xs sm:text-base rounded-md bg-dark py-2 px-4 sm:py-3 sm:px-9 ease-out duration-200 hover:bg-blue mt-4 sm:mt-8 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
                style={{ position: 'relative', zIndex: 20 }}
                aria-label="En savoir plus sur le matériel de musculation"
              >
                <span className="text-xs sm:text-sm font-medium md:text-base">
                  en savoir plus
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sample Products Grid - transformed cards */}
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div className={`grid gap-8 ${
          sampleProducts.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          sampleProducts.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
          sampleProducts.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {sampleProducts.map((product, idx) => {
            const normalized = mapToProductCard(product, idx);
            return (
              <Card
                key={normalized._id || idx}
                className="group relative overflow-hidden h-full flex flex-col shadow-none bg-white border-0 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 rounded-lg"
                role="article"
                aria-label={`Produit: ${normalized.designation || "Produit"}`}
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {normalized.oldPrice && normalized.oldPrice > normalized.price && (
                    <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }} className="text-xs font-bold px-2 py-1">
                      -{Math.round(((normalized.oldPrice - normalized.price) / normalized.oldPrice) * 100)}%
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
                    onClick={e => handleItemToWishList(normalized, e)}
                    aria-label={`Ajouter ${normalized.designation || "ce produit"} à la liste de souhaits`}
                  >
                    <Heart className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full focus:ring-2 focus:ring-orange-500 focus:ring-offset-2" 
                    onClick={e => handleQuickViewUpdate(normalized, e)}
                    aria-label={`Aperçu rapide de ${normalized.designation || "ce produit"}`}
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
                <CardContent className="flex flex-col h-full p-4">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    <Link 
                      href={`/musculation-products/${normalized.slug}`}
                      className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
                      aria-label={`Voir les détails de ${normalized.designation || "ce produit"}`}
                    >
                      <Image
                        src={getImageUrl(normalized)}
                        alt={`Image de ${normalized.designation || "produit de musculation"}`}
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
                    <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
                      <Link 
                        href={`/musculation-products/${normalized.slug}`}
                        className="focus:outline-none focus:underline focus:text-orange-600"
                        aria-label={`Voir les détails de ${normalized.designation || "ce produit"}`}
                      >
                        {normalized.designation || "Produit"}
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
                        <span className="text-custom-sm ml-1" aria-label={`${normalized.reviews?.length && normalized.reviews.length > 0 ? normalized.reviews.length : getFakeReviewCount(normalized._id)} avis`}>
                          {normalized.reviews?.length && normalized.reviews.length > 0
                            ? `(${normalized.reviews.length})`
                            : `(${getFakeReviewCount(normalized._id)})`}
                        </span>
                      </div>
                    </div>
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4 justify-center" role="group" aria-label="Prix du produit">
                      <span 
                        style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 700, fontSize: '1.25rem' }}
                        aria-label={`Prix actuel: ${Number(normalized.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`}
                      >
                        {Number(normalized.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                      </span>
                      {normalized.oldPrice && normalized.oldPrice > normalized.price && (
                        <span 
                          className="text-sm text-gray-500 line-through"
                          aria-label={`Prix original: ${Number(normalized.oldPrice).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`}
                        >
                          {Number(normalized.oldPrice).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full font-medium py-3 rounded-lg shadow-lg hover:shadow-xl focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center" 
                    style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', color: '#fff', fontWeight: 600, fontSize: '1rem' }} 
                    onClick={e => handleAddToCart(normalized, e)} 
                    disabled={isAddingToCart === normalized._id || !normalized.inStock}
                    aria-label={`${isAddingToCart === normalized._id ? "Ajout en cours" : normalized.inStock ? `Ajouter ${normalized.designation || "ce produit"} au panier` : "Produit indisponible"}`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2 text-white" aria-hidden="true" />
                    {isAddingToCart === normalized._id ? "Ajout en cours..." : normalized.inStock ? "Ajouter au panier" : "Indisponible"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MusculationProducts;