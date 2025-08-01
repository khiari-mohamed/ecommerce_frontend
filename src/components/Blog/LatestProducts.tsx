import React from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id?: string;
  title: string;
  price: number | string;
  cover?: string;
  slug?: string;
  alt_cover?: string;
  meta?: string;
};

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
            let imageUrl = "";
            if (product.cover) {
              if (product.cover.startsWith("http")) {
                imageUrl = product.cover;
              } else {
                imageUrl = "/" + product.cover.replace(/^\/+/, "");
              }
            }
            if (!imageUrl) {
              imageUrl = "/images/placeholder.png";
            }

            const imageAlt = product.alt_cover || product.title || "product";
            const seoTitle = product.meta || product.title;
            const productLink = product.slug
              ? `/products/${product.slug}`
              : "/shop-details";

            return (
              <Link href={productLink} key={product._id || key} className="flex items-center gap-6 group">
                <div className="flex items-center justify-center rounded-[10px] h-[106px] max-w-[106px] w-full sm:bg-gray-3 sm:max-w-[90px] sm:h-22.5">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    title={seoTitle}
                    width={106}
                    height={106}
                    className="rounded-[10px] object-cover block"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-dark mb-1 ease-out duration-200 group-hover:text-[#ff6600]">
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
