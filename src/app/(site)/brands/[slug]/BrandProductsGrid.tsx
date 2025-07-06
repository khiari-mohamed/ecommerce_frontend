"use client";
import dynamic from "next/dynamic";
import React from "react";

const ProductCard = dynamic(() => import("@/components/shared/productCard"), { ssr: false });

interface BrandProductGridProps {
  products: any[];
}

const BrandProductGrid: React.FC<BrandProductGridProps> = ({ products }) => {
  const safeProducts = Array.isArray(products) ? products : [];
  return (
  <div className="mt-[180px] md:mt-10">
  <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Produits de la marque</h2>
      {safeProducts.length === 0 ? (
        <div className="text-center text-gray-400">Aucun produit trouvé pour cette marque.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safeProducts.map((product) => {
            // Map API fields to ProductCard expected props
            const mappedProduct = {
              ...product,
              designation: product.designation_fr,
              mainImage: {
                url: product.cover
                  ? product.cover.startsWith("http")
                    ? product.cover
                    : `/${product.cover}`
                  : "/placeholder.svg",
              },
              price: product.promo ?? product.prix,
              oldPrice: product.promo ? product.prix : undefined,
              slug: product.slug,
              inStock: product.inStock,
              brand: product.brand_id,
              reviews: product.reviews ?? [],
            };
            return <ProductCard key={product._id} product={mappedProduct} typeRef={"shop-details?slug"} />;
          })}
        </div>
      )}
    </div>
  );
};


export default BrandProductGrid;    