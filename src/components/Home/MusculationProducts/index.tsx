"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/shared/productCard";
import { fetchMusculationProducts } from "@/services/Musculationproducts";
import { MusculationProduct } from "@/types/MusculationProducts";

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

// Add your images here
const images = [
  "/img/v2.jpg",
  "/img/v3.jpg",
  "/img/v4.jpg",
  "/img/vv7.jpg",
];

const IMAGE_CHANGE_INTERVAL = 4000; // 3 seconds
const FADE_DURATION = 1.2; // seconds

const MusculationProducts = () => {
  const [current, setCurrent] = useState(0);
  const [sampleProducts, setSampleProducts] = useState<MusculationProduct[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, IMAGE_CHANGE_INTERVAL);
    return () => clearTimeout(timeout);
  }, [current]);

  useEffect(() => {
    // Fetch products and set the first 4 as sample
    const fetchProducts = async () => {
      try {
        const products = await fetchMusculationProducts();
        setSampleProducts(products.slice(10, 14));
      } catch (e) {
        setSampleProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full mt-16 sm:mt-20 md:mt-24">
      {/* Section Header */}
      <div className="w-full mx-auto max-w-screen-2xl">
        <motion.div
          className="max-w-screen-xl px-2 sm:px-4 mx-auto md:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h3
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-[22px] sm:text-[28px] text-center text-white uppercase font-extrabold mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Materiel de Musculation
          </motion.h3>
        </motion.div>
      </div>

      {/* Banner Image Section */}
      <div className="relative w-full min-h-[220px] h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden flex items-center justify-center">
        {/* Crossfade Images */}
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

        {/* Gradient Overlay and Content */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40 z-10 flex items-center justify-center">
          <div className="w-full flex flex-col items-center sm:items-start justify-center px-2 sm:px-6 md:px-12 lg:px-24 py-4 sm:py-8 max-w-4xl">
            <motion.h2
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mb-2 text-lg sm:text-xl md:text-2xl lg:text-4xl font-extrabold text-center sm:text-left uppercase"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              Matériel de Musculation
            </motion.h2>
            <motion.p
              variants={fadeFromLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="max-w-full sm:max-w-2xl mb-2 sm:mb-4 text-xs sm:text-base md:text-lg text-center sm:text-left text-gray-300"
            >
              Découvrez notre gamme complète de matériel musculation, fitness et
              cardio pour équiper votre salle de sport. Atteignez vos objectifs
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
              <Link href="/musculation-products">
                <button
                  className="inline-flex font-medium text-white text-xs sm:text-base rounded-md bg-dark py-2 px-4 sm:py-3 sm:px-9 ease-out duration-200 hover:bg-blue mt-4 sm:mt-8"
                >
                  <span className="text-xs sm:text-sm font-medium md:text-base">
                    en savoir plus
                  </span>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sample Products Grid */}
      <div className="w-full mx-auto max-w-screen-2xl px-2 sm:px-4 md:px-8 mt-6 sm:mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {sampleProducts.map((product, idx) => (
          <ProductCard key={product._id || idx} product={mapToProductCard(product, idx)} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default MusculationProducts;
