"use client";
import React, { useEffect, useState } from "react";
import ProductItem from "@/components/Common/ProductItem";
import Image from "next/image";
import Link from "next/link";
import { getTopProductsFeature } from "@/services/products";
import type { Product } from "@/types/product";


const BestSeller = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopProductsFeature()
    .then((data) => { 
    console.log('Number of products returned by getTopProductsFeature:', data.length);
    setProducts(data);
    })
    .finally(() => setLoading(false));
    }, []);

  return (
    <section className="overflow-hidden">
      <div className="w-full mx-auto px-2 sm:px-4 pb-10 sm:pb-15 border-b border-gray-3">
        {/* <!-- section title --> */}
        <div className="mb-6 sm:mb-10 flex flex-col gap-4">
          <h2
            className="font-semibold text-lg sm:text-xl xl:text-heading-5 text-dark text-center w-full"
            style={{ color: '#FF4500' }}
          >
            Meilleures ventes
          </h2>
        </div>  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-7.5 gap-y-6 md:gap-y-9">
          {loading ? (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex justify-center items-center py-10">
              <span>Chargement...</span>
            </div>
          ) : (
            products.slice(0, 4).map((item, key) => {
              const normalizedItem = {
                ...item,
                id: typeof item._id === "string" ? Number(item._id) : item._id ?? item.id, // <-- force id to number
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
              };
              return <ProductItem item={normalizedItem} key={key} />;
            })
          )}
        </div>
        <div className="text-center mt-8 sm:mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-5 sm:px-7 md:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent w-full sm:w-auto text-center justify-center"
          >
            Tout voir
          </Link>
        </div>
      </div>
    </section>
  ); 
};

export default BestSeller;
