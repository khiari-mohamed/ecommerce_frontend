"use client";
import { motion } from "framer-motion";
import ProductCard from "@/components/shared/productCard";
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
  _id: product._id,
  ...product,
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
  inStock: product.qte && Number(product.qte) > 0,
  slug: product.slug,
  brand: product.brand_id,
  reviews: [],
});

const MusculationProductsClient = () => {
  const [productsData, setProductsData] = useState<MusculationProduct[]>([]);
  const { user } = useAuth();

  // Dynamic header offset for mobile/desktop (robust React way, matches other pages)
  function ClientHeaderOffset() {
  useEffect(() => {
  function setOffset() {
  const header = document.querySelector('header');
  if (header) {
  const rect = header.getBoundingClientRect();
  document.documentElement.style.setProperty('--header-offset-musc', rect.height + 'px');
  } else {
  document.documentElement.style.setProperty('--header-offset-musc', '8rem');
  }
  }
  setOffset();
  window.addEventListener('resize', setOffset);
  return () => window.removeEventListener('resize', setOffset);
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
              navigation
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pt-8 pb-16 sm:pb-20 md:pb-24"
            >
              {productsData.map((product, idx) => (
                <SwiperSlide key={product._id || idx}>
                  <ProductCard
                    user={user}
                    product={mapToProductCard(product, idx)}
                    typeRef="musculation-products"
                    fallbackImage={getFallbackImageByIndex(idx)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>

              </div>
    </>
  );
};

export default MusculationProductsClient;
