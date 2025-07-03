"use client";
import { storage } from "@/const/urls";
import Image from "next/image";
import React from "react";

function ProductImage({ alt, img }: { img: string; alt: string }) {
  const [error, setError] = React.useState(false);
  return (
    <>
      {!error ? (
        <Image
          width={300}
          height={200}
          src={img ? storage + img : "/public/img/product/p1.webp"}
          alt={alt ?? ""}
          className="w-full h-full object-cover"
          loading="eager"
          onError={() => {
            console.log("error while loading image ,fallback to img tag");
            setError(true);
          }}
        />
      ) : (
        <img
          src={img ? storage + img : "/public/img/product/p1.webp"}
          alt={alt}
          className="w-full h-full object-cover"
        />
      )}
    </>
  );
}

export default ProductImage;
