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
        setProducts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-2 sm:px-4 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:w-auto flex flex-col">
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              Ce mois-ci
            </span>
            <h2 className="font-semibold text-lg sm:text-xl xl:text-heading-5 text-dark">
            Meilleures ventes
            </h2>
          </div>  
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-7.5 gap-y-6 sm:gap-y-9">
          {loading ? (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex justify-center items-center py-10">
              <span>Chargement...</span>
            </div>
          ) : (
            products.map((item, key) => (
              <ProductItem item={item} key={key} />
            ))
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
