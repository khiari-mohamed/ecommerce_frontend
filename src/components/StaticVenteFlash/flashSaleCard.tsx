"use client";
import { useState } from "react";
import { storage } from "./const/url";
import Image from "next/image";
import Link from "next/link";
import Star from "./stars";
import CountdownTimer from "./flasSaleCounter";

function FlashSaleCard({ product }: { product: any }) {
  const [rating, setRating] = useState(0); // Always start with no stars selected
  const productPromoPercentage = Math.ceil(
    ((product.prix - product.promo) / product.prix) * 100
  );

  // Function to handle star click
  const handleStarClick = (newRating: number) => {
    setRating(newRating);
    // You could send this rating to your backend or update it in the store if needed
  };

  return (
    <div className="w-full max-w-[920px] sm:max-w-[700px] prod_border flex flex-col lg:flex-row bg-white shadow-sm hover:shadow-md mx-auto">
      <div className="w-full relative">
        <Link href={`/product-details?id=${product.id}`}>
          <div className="w-full aspect-[5/6] sm:aspect-square max-w-[160px] sm:max-w-full relative mx-auto overflow-hidden">
            <Image
              fill
              alt={product.alt_cover || product.designation_fr}
              src={
                product.cover
                  ? product.cover.startsWith("http")
                    ? product.cover
                    : storage + product.cover
                  : "/public/img/product/p1.webp"
              }
              className="object-contain"
            />
          </div>
        </Link>
        {productPromoPercentage && (
          <div className="pourcentageproduct promo absolute top-0 bg-primary text-white text-xs h-5 pr-2.5 pl-2 flex items-center font-semibold">
            {productPromoPercentage} %
          </div>
        )}
      </div>
      <div className="w-full displayvente lkl">
        <Link href={`/product-details?id=${product.id}`} className="displaylink">
          <h1 className="font-weight-700 text-gray-900 hover:text-primary hover:underline title-font mb-4 sm:mb-4 text-[11px] sm:text-base lg:text-xl">
            {product.designation_fr}
          </h1>
        </Link>
        <span className="flex items-center gap-0.5 mb-4">
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

        {product.promo ? (
          <div className="flex flex-row items-center gap-2 mb-4">
            <span className="text-primary font-semibold fontprix">{product.promo} DT</span>
            <span className="text-gray-500 line-through fontprix">{product.prix} DT</span>
          </div>
        ) : (
          <span className="text-primary font-semibold fontprix mb-4 block">{product.prix} DT</span>
        )}

        <div className="flex items-center flex-wrap mb-2 sm:mb-4">
          <span className="text-black font-semibold mr-2">
            dépêchez-vous! Les offres se terminent en :
          </span>
        </div>
        <div className="mt-2 sm:mt-4">
          <CountdownTimer endDate={product.promo_expiration_date} />
        </div>
      </div>
    </div>
  );
}

export default FlashSaleCard;
