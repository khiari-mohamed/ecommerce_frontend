"use client";
import React from "react";
import SubcategoryProductCard from "@/components/SubcategoryProductCard";

interface BrandProductGridProps {
  products: any[];
}

const BrandProductGrid: React.FC<BrandProductGridProps> = ({ products }) => {
  const safeProducts = Array.isArray(products) ? products : [];
  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-gray-800">
        Produits de la marque
      </h2>
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