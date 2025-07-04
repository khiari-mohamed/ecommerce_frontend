/*"use client";

import { useState } from "react";
import Link from "next/link";
import ProductModal from "./productModal";
import Star from "./stars";
import AddToCartButton from "./addToCartButton";
import ProductImage from "./productImage";
import { storage } from "@/const/urls";

const ProductCard = ({ product }: { product: any }) => {
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
        <Link href={`/shop/${product.slug}`} className="w-full shadow-lg relative pt-10">
          <div className="w-full aspect-square rounded overflow-hidden flex">
            <ProductImage img={product?.cover} alt={product.designation_fr} />
          </div>
          </Link>

          {productPromoPercentage && (
            <span
              className="label_sale absolute top-0 right-[15px] z-10 bg-[#ff4000] text-white text-[12px] font-semibold px-[10px] py-0 h-[21px] leading-[23px] text-center block border border-white capitalize"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                borderRadius: 6,
                minWidth: 48,
                height: 21,
                lineHeight: '23px',
                boxShadow: '0 2px 8px 0 rgba(255,64,0,0.15)',
                letterSpacing: '0.04em',
                paddingLeft: 8,
                paddingRight: 10,
              }}
            >
              Promo {productPromoPercentage} %
            </span>
          )}
          {!!Number(product.new_product) && (
            <span
              className="label_new absolute"
              style={{
                top: 24,
                right: 15,
                textTransform: 'capitalize',
                color: '#fff',
                background: '#1560b2',
                fontSize: 12,
                fontWeight: 600,
                padding: '0 10px 0 8px',
                height: 21,
                lineHeight: '23px',
                textAlign: 'center',
                display: 'block',
                borderRadius: 6,
                fontFamily: 'Montserrat, sans-serif',
                border: '1px solid #fff',
                zIndex: 10,
                minWidth: 48,
                boxShadow: '0 2px 8px 0 rgba(21,96,178,0.15)',
                letterSpacing: '0.04em',
                position: 'absolute',
              }}
            >
              Nouveau
            </span>
          )}
          <div className="mt-4 mb-2 flex flex-col items-center text-center w-full">
            <Link href={`/shop/${product.slug}`} className="w-full shadow-lg relative pt-10">
              <h2 className="font-weight-700 text-gray-900 product-card-title hover:text-[#0d6efd] title-font text-sm font-medium w-full text-center">
                {product.designation_fr}
              </h2>
            </Link>
            <span className="flex flex-row items-center justify-center gap-0.5 w-full">
              {[1, 2, 3, 4, 5].map((star, i) => {
                const isFilled = i < rating;
                return (
                  <Star
                    key={i}
                    fill={isFilled ? "#EAB308" : "none"}
                    onClick={() => handleStarClick(i + 1)}
                    className="cursor-pointer"
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

export default ProductCard;*/
