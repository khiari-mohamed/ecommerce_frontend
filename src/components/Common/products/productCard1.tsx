/*"use client";

import { useState } from "react";
import Link from "next/link";
import ProductModal from "./productModal";
import Star from "./stars";
import AddToCartButton from "./addToCartButton";
import ProductImage from "./productImage";
import { storage } from "@/const/urls";

const ProductCard1 = ({ product }: { product: any }) => {
  const [rating, setRating] = useState(0); // Always start with no stars selected
  const productPromoPercentage = Math.ceil(
    ((product.prix - product.promo) / product.prix) * 100
  );
  const isUnavailable = product.rupture === 0;

  const handleStarClick = (newRating: number) => {
    setRating(newRating);
    // Optionally, send this rating to the backend or update it in the store
  };

  return (
    <div
      key={product.id}
      className="w-full relative group isolate flex flex-col"
    >
      <div className="prod_border bg-white py-2 px-2.5 z-0 relative">
        <Link href={isUnavailable ? "#" : `/shop/${product.slug}`} className="w-full shadow-lg relative pt-10">
          <div className="w-full aspect-square rounded overflow-hidden flex">
            <ProductImage img={product?.cover} alt={product.designation_fr} />
          </div>
          </Link>

          {productPromoPercentage && (
            <div className="pourcentageproduct promo absolute top-0 bg-primary text-white text-xs h-5 pr-2.5 pl-2 flex items-center font-semibold">
              {productPromoPercentage} %
            </div>
          )}
          {!!Number(product.new_product) && (
            <div className="pourcentageproduct absolute promo top-10 bg-blue-700 text-white text-xs h-5 pr-2.5 pl-2 flex items-center font-semibold">
              New
            </div>
          )}
          <div className="mt-4 mb-2">
          <Link href={isUnavailable ? "#" : `/shop/${product.slug}`} className="w-full shadow-lg relative pt-10">

            <h2 className="font-weight-700 text-gray-900 product-card-title hover:text-[#0d6efd] title-font text-sm font-medium">
              {product.designation_fr}
            </h2>
            </Link>
            <span className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star, i) => {
                const isFilled = i < rating;
                return (
                  <Star
                    key={i}
                    fill={isFilled ? "#EAB308" : "none"}
                    onClick={() => handleStarClick(i + 1)} // Make star clickable
                    className="cursor-pointer" // Show clickable cursor
                  />
                );
              })}
            </span>
          </div>
        <div className="foocard">
          {product.promo ? (
            <div className="mt-2 flex flex-row items-center gap-1">
              <span className="text-primary font-semibold">
                {product.promo} DT
              </span>
              <span className="text-gray-500 line-through">
                {product.prix} DT
              </span>
              <AddToCartButton product={product} disabled={isUnavailable} />
            </div>
          ) : (
            <span className="text-primary font-semibold">
              {product.prix} DT
            </span>
          )}
        </div>
      </div>

      {isUnavailable && (
        <div className="absolute inset-0 bg-white/20 flex pointer-events-none">
          <div className="bg-primary my-auto w-full px-1 py-2 z-20">
            <p className="text-white text-sm font-medium text-center">
              Rupture De Stock
            </p>
          </div>
        </div>
      )}

      {!isUnavailable && (
        <div className="hidden group-hover:flex items-center justify-center absolute inset-0 m-auto w-10 h-10 pt-1 bg-primary rounded z-20">
          <ProductModal productslug={product?.slug} />
        </div>
      )}
    </div>
  );
};

export default ProductCard1;*/
