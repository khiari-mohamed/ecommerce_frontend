
/*"use client";
import { useEffect, useState } from "react";
import ProductCard from "../../shared/productCard";
import { useAuth } from "../../../context/authContext";
import { motion, AnimatePresence } from "framer-motion";
import Countdown from "./Countdown";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FALLBACK_IMAGE = "/static-flash/p8.png"; // Place this image in your public folder

function mapProductToCard(product: any): any {
  return {
    ...product,
    _id: product._id || product.id,
    designation: product.designation || product.designation_fr,
    mainImage: { url: product.mainImage?.url || product.cover || FALLBACK_IMAGE },
    inStock: true, // FORCE TRUE
    slug: product.slug,
    price: product.price,
    oldPrice: product.oldPrice,
    brand: product.brand,
    reviews: product.reviews || [],
  };
}

type FlashSale = {
  id: string;
  designation_fr: string;
  cover: string;
  description: string;
  slug: string;
  endTime?: string;
  discount?: number;
};

type Product = any; // Replace with your Product type if available

const staticFlashSales: FlashSale[] = [
  // ... your static flash sales as before ...
];

const staticProductsMap: { [id: string]: Product[] } = {
  // ... your static products as before ...
};

const VenteFlash = () => {
  const { user } = useAuth();
  const [flashSales, setFlashSales] = useState<FlashSale[]>(staticFlashSales);
  const [productsMap, setProductsMap] = useState<{ [id: string]: Product[] }>({ ...staticProductsMap });
  const [timers, setTimers] = useState<{ [id: string]: { hours: number; minutes: number; seconds: number } }>({});
  const [productsLoaded, setProductsLoaded] = useState<{ [id: string]: boolean }>({
    "static-1": true,
    "static-2": true,
    "static-3": true,
  });
  const [currentFlashIndex, setCurrentFlashIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const res = await axios.get(`${API_URL}/vente-flash`);
        const filtered = res.data.filter(
          (item: FlashSale) => !staticFlashSales.some((s) => s.id === item.id)
        );
        const limited = filtered.slice(0, 5);
        setFlashSales([...staticFlashSales, ...limited]);

        const initialTimers: typeof timers = {};
        limited.forEach((item: FlashSale) => {
          if (item.endTime) {
            initialTimers[item.id] = calculateTimeRemaining(item.endTime);
          }
        });
        setTimers((prev) => ({ ...prev, ...initialTimers }));

        const productsFetches = limited.map((item: FlashSale) =>
          axios
            .get(`${API_URL}/vente-flash/${item.id}/products`)
            .then(r => ({ id: item.id, products: r.data }))
            .catch(() => ({ id: item.id, products: [] }))
        );
        const productsResults = await Promise.all(productsFetches);
        const map: { [id: string]: Product[] } = {};
        const loaded: { [id: string]: boolean } = {};
        productsResults.forEach(({ id, products }) => {
          map[id] = Array.isArray(products) ? products : [];
          loaded[id] = true;
        });
        setProductsMap((prev) => ({ ...prev, ...map }));
        setProductsLoaded((prev) => ({ ...prev, ...loaded }));
      } catch (error) {
        console.error("Error fetching flash sales or products:", error);
      }
    };
    fetchFlashSales();
  }, []);

  useEffect(() => {
    setCurrentProductIndex(0);
  }, [currentFlashIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated: typeof prev = {};
        for (const id in prev) {
          updated[id] = updateTimer(prev[id]);
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateTimer = (prev: { hours: number; minutes: number; seconds: number }) => {
    if (!prev) return { hours: 0, minutes: 0, seconds: 0 };
    if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
    if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
    if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const calculateTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return {
      hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
      seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
    };
  };

  const goToPrevFlash = () => {
    setCurrentFlashIndex((prev) => (prev === 0 ? flashSales.length - 1 : prev - 1));
  };
  const goToNextFlash = () => {
    setCurrentFlashIndex((prev) => (prev === flashSales.length - 1 ? 0 : prev + 1));
  };

  const currentFlash = flashSales[currentFlashIndex];
  const currentProducts = productsMap[currentFlash?.id] || [];
  const mainProduct = currentProducts.length > 0 ? currentProducts[currentProductIndex] : null;

  const goToPrevProduct = () => {
    setCurrentProductIndex((prev) =>
      prev === 0 ? currentProducts.length - 1 : prev - 1
    );
  };
  const goToNextProduct = () => {
    setCurrentProductIndex((prev) =>
      prev === currentProducts.length - 1 ? 0 : prev + 1
    );
  };

  const ArrowLeft = (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const ArrowRight = (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <section className="w-full py-12 bg-gradient-to-br from-red-50 via-yellow-50 to-orange-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, x: 40 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
          }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white uppercase mb-2 tracking-wide">
            Ventes Flash en Cours
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default VenteFlash;


/*
import { host, storage } from "@/const/urls";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FlashSaleCard from "../../Common/products/flashSaleCard";


async function FlashSale({ products }: { products: any[] }) {

  return (
    <div className="container py-12 mx-auto">
        <h2 className="mb-10 uppercase font-bold text-2xl tracking-wide text-center text-[#ff4000]">
          VENTES FLASH
        </h2>
          <div className="productmarging grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products &&
              products?.length > 0 &&
              products?.map((product: any) => {
                return <FlashSaleCard key={product?.id} product={product} />;
              })}
          </div>
        </div>
  );
}

export default FlashSale;
*/

// index.tsx
export default function VenteFlash() {
  return null; // or a placeholder message
}