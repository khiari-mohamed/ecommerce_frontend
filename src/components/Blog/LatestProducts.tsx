import React from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id?: string;
  title: string;
  price: number | string;
  imgs?: {
    thumbnails?: string[];
  };
  slug?: string;
  alt_img?: string;
  meta?: string;
};

const PRODUCT_IMAGE_BASE = "/uploads/"; // Adjust if your CDN/static path is different

const LatestProducts = ({ products }: { products: Product[] }) => {
  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">Derniers produits</h2>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          {/* <!-- product item --> */}
          {products.slice(0, 3).map((product, key) => {
            // Normalize image URL for /produits/...
            let imageUrl = "";
            if (product.imgs?.thumbnails?.[0]) {
              const url = product.imgs.thumbnails[0];
              if (url.startsWith("http") || url.startsWith("/produits/")) {
                imageUrl = url;
              } else if (url.includes("produits/")) {
                imageUrl = "/" + url.slice(url.indexOf("produits/"));
              } else {
                imageUrl = "/" + url.replace(/^public[\\/]/, "");
              }
            }
            if (!imageUrl) {
            imageUrl = "/images/placeholder.png";
            } else if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
            imageUrl = "/" + imageUrl.replace(/^\/+/g, "");
            } else if (imageUrl.startsWith("//")) {
            imageUrl = imageUrl.replace(/^\/+/g, "/");
            }

            const imageAlt = product.alt_img || product.title || "product";
            const seoTitle = product.meta || product.title;
            const productLink = product.slug
              ? `/products/${product.slug}`
              : "/shop-details";

            return (
              <Link href={productLink} key={product._id || key} className="flex items-center gap-6 group">
                <div className="flex items-center justify-center rounded-[10px] bg-gray-3 max-w-[90px] w-full h-22.5">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    title={seoTitle}
                    width={74}
                    height={74}
                    className="rounded-[10px] w-full"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1 ease-out duration-200 group-hover:text-blue">
                    {product.title}
                  </h3>
                  <p className="text-custom-sm">
                    Prix :
                    {typeof product.price === "number"
                      ? ` ${product.price.toFixed(2)} DT`
                      : ` ${product.price} DT`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestProducts;
