"use client";
import React, { useEffect, useState } from "react";
import ProductItem from "@/components/Common/ProductItem";
import axios from "@/lib/axios";

const PromotionsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/products/store/promotions")
      .then(res => {
        // Map API fields to expected ProductItem fields
        const mapped = (res.data.data || []).map((item) => ({
          ...item,
          price: Number(item.prix ?? item.price) || 0,
          discountedPrice: Number(item.promo ?? item.discountedPrice) || Number(item.prix ?? item.price) || 0,
          cover: item.cover || item.mainImage?.url || "",
          title: item.designation_fr || item.designation || "",
        }));
        setProducts(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <h2 className="font-semibold text-xl xl:text-heading-5 text-dark mb-7">Promotions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
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