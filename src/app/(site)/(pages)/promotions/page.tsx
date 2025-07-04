
"use client";
import React, { useEffect, useState } from "react";
import ProductItem from "@/components/Common/ProductItem";
import axios from "@/lib/axios";

const PromotionsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Robust normalization logic
  function normalizeProduct(item) {
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
  
  useEffect(() => {
  axios.get("/products/store/promotions")
  .then(res => {
  // Map API fields to expected ProductItem fields
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

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <h2 className="font-semibold text-xl xl:text-heading-5 text-dark mb-7">Promotions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9">
          {loading ? (
            <div className="col-span-4 flex justify-center items-center py-10">
              <span>Chargement...</span>
            </div>
          ) : (
            products.map((item, key) => (
              <ProductItem item={item} key={key} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PromotionsPage;