// src/components/ShopDetails/RecentlyViewd/index.tsx
"use client";
import React, { useCallback, useRef, useState, useEffect } from "react";
import type { Swiper as SwiperClass } from "swiper"; // <-- Add this import
import "swiper/css/navigation";
import "swiper/css";
import { useAppSelector } from "@/redux/store";
import { getRelatedProducts } from "@/services/products";
import { Product } from '@/types/product';


const RecentlyViewdItems = () => {
  const sliderRef = useRef<SwiperClass | null>(null); // <-- Type the ref
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const currentProduct = useAppSelector((state) => state.productDetailsReducer.value);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (currentProduct?.category && typeof currentProduct.category === 'object' && currentProduct.category._id) {
        const products = await getRelatedProducts(currentProduct.category._id);
        setRelatedProducts(products);
      }
    };
    // ...
    
    fetchRelatedProducts();
  }, [currentProduct]);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.slidePrev(); // <-- Use slidePrev directly
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.slideNext(); // <-- Use slideNext directly
  }, []);

  return (
  <div>
    <h2>No products available</h2>
  </div>
);
};

export default RecentlyViewdItems;