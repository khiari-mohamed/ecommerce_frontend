"use client";
import React from "react";
import SubcategoryProductCard from "@/components/SubcategoryProductCard";

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
          {safeProducts.map((product) => (
            <SubcategoryProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};


export default BrandProductGrid;    