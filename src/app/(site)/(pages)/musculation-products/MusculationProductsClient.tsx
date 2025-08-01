"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { fetchMusculationProducts } from "@/services/Musculationproducts";
import { MusculationProduct } from "@/types/MusculationProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

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

const MusculationProductsClient = () => {
  const [productsData, setProductsData] = useState<MusculationProduct[]>([]);
  const { user } = useAuth();
  const swiperRef = React.useRef<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModalContext();

  // Dynamic header offset for mobile/desktop (robust React way, matches other pages)
  function ClientHeaderOffset() {
  React.useEffect(() => {
  let lastHeight = 0;
  let animationFrame;
  function setOffset() {
  const header = document.querySelector('header');
  if (header) {
  const rect = header.getBoundingClientRect();
  if (rect.height !== lastHeight) {
  document.documentElement.style.setProperty('--header-offset-musc', rect.height + 'px');
  lastHeight = rect.height;
  }
  } else {
  document.documentElement.style.setProperty('--header-offset-musc', '8rem');
  lastHeight = 0;
  }
  animationFrame = requestAnimationFrame(setOffset);
  }
  setOffset();
  window.addEventListener('resize', setOffset);
  window.addEventListener('orientationchange', setOffset);
  const header = document.querySelector('header');
  if (header) {
  header.addEventListener('transitionend', setOffset);
  }
  return () => {
  window.removeEventListener('resize', setOffset);
  window.removeEventListener('orientationchange', setOffset);
  if (header) header.removeEventListener('transitionend', setOffset);
  cancelAnimationFrame(animationFrame);
  };
  }, []);
  return null;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetchMusculationProducts();
      setProductsData(products);
    };
    fetchProducts();
  }, []);

  return (
  <>
  <ClientHeaderOffset />
  <div className="w-full" style={{ marginTop: 'var(--header-offset-musc, 8rem)' }}>
  <div className="w-full mx-auto max-w-screen-2xl">
          <motion.div
            className="max-w-screen-xl px-4 mx-auto md:px-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-black3 uppercase font-bold rubik mb-4"
            >
              Materiel de Musculation
            </motion.h3>
          </motion.div>
        </div>

        <div className="w-full mx-auto max-w-screen-2xl">
          <motion.div
            className="max-w-screen-xl px-4 mx-auto mt-16 mb-24 md:px-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Swiper
              modules={[Navigation]}
              navigation={false}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pt-8 pb-16 sm:pb-20 md:pb-24"
              onSwiper={swiper => (swiperRef.current = swiper)}
            >
              {productsData.map((product, idx) => {
                const mapped = mapToProductCard(product, idx);
                // Hooks moved to top-level
                // const dispatch = useDispatch<AppDispatch>();
                // const { openModal } = useModalContext();
                // Normalize for cart/wishlist/quickview
                const normalized = {
                  ...mapped,
                  price: mapped.price,
                  discountedPrice: mapped.oldPrice ?? mapped.price,
                  title: mapped.designation,
                  designation: mapped.designation,
                  cover: mapped.mainImage.url,
                  imgs: { thumbnails: [mapped.mainImage.url], previews: [mapped.mainImage.url] },
                  mainImage: mapped.mainImage,
                  images: [{ url: mapped.mainImage.url }],
                  _id: mapped._id,
                  slug: mapped.slug,
                };
                const handleQuickViewUpdate = () => {
                  dispatch(updateQuickView(normalized));
                  openModal();
                };
                const handleAddToCart = () => {
                  const id = normalized._id ?? `${Date.now()}-${Math.random()}`;
                  dispatch(addItemToCart({ ...normalized, id, quantity: 1, image: normalized.cover }));
                };
                const handleItemToWishList = () => {
                  const id = normalized._id ?? `${Date.now()}-${Math.random()}`;
                  dispatch(addItemToWishlist({ ...normalized, id, status: "available", quantity: 1 }));
                };
                return (
                  <SwiperSlide key={product._id || idx}>
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
                        {mapped.oldPrice && mapped.price > mapped.oldPrice && (
                          <Badge style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }} className="text-xs font-bold px-2 py-1">
                            -{Math.round(((mapped.price - mapped.oldPrice) / mapped.price) * 100)}%
                          </Badge>
                        )}
                        <Badge style={{ background: '#1cac54', color: '#fff', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem', boxShadow: '0 2px 8px 0 rgba(28,172,84,0.15)' }} className="text-xs font-bold px-2 py-1 mt-1">
                          New
                        </Badge>
                      </div>
                      {/* Action buttons */}
                      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); handleItemToWishList(); }}>
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full" onClick={e => { e.preventDefault(); handleQuickViewUpdate(); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      <CardContent className="flex flex-col h-full p-4">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={mapped.mainImage.url}
                            alt={mapped.designation}
                            fill
                            className="w-full h-full object-cover"
                            loading="lazy"
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300" />
                        </div>
                        {/* Product Info */}
                        <div className="flex-grow flex flex-col">
                          <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] text-center">
                            <Link href={`/shop/${mapped.slug}`}>{mapped.designation}</Link>
                          </h3>
                          {/* Price */}
                          <div className="flex items-center gap-2 mb-4 justify-center">
                            <span style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f59e42 100%)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 700, fontSize: '1.25rem' }}>
                              {Number(mapped.oldPrice ?? mapped.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
                            </span>
                            {mapped.oldPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {Number(mapped.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
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
                  </SwiperSlide>
                );
              })}
            </Swiper>
            {/* Custom navigation buttons below the Swiper */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                aria-label="Previous"
                onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
                className="custom-swiper-prev w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 hover:bg-[#FF4301] transition-colors duration-200"
              >
                <span className="sr-only">Previous</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                aria-label="Next"
                onClick={() => swiperRef.current && swiperRef.current.slideNext()}
                className="custom-swiper-next w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 hover:bg-[#FF4301] transition-colors duration-200"
              >
                <span className="sr-only">Next</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <style global jsx>{`
              .swiper-button-next,
              .swiper-button-prev {
                display: none !important;
              }
              .swiper-pagination-bullet-active {
                background: #FF4301;
              }
              @media (max-width: 639px) {
                .custom-swiper-prev,
                .custom-swiper-next {
                  width: 40px !important;
                  height: 40px !important;
                }
              }
            `}</style>
          </motion.div>
        </div>

              </div>
    </>
  );
};

export default MusculationProductsClient;
