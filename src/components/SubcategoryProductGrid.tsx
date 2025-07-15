"use client";
import { useEffect, useState } from "react";
import SubcategoryProductCard from "./SubcategoryProductCard";
import { useSearchParams } from "next/navigation";

export default function SubcategoryProductGrid({ products }: { products: any[] }) {
  const [keywordsData, setKeywordsData] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const keywordsParam = (searchParams?.get("keywords") || "").split(",").filter(Boolean);

  useEffect(() => {
    fetch("/api/keywords")
      .then((res) => res.json())
      .then(setKeywordsData);
  }, []);

  let filteredProducts = products;

  if (keywordsParam.length > 0 && keywordsData.length > 0) {
    const allowedProductIds = new Set(
      keywordsData
        .filter((kw: any) => keywordsParam.includes(kw.keyword))
        .flatMap((kw: any) => kw.product_ids)
    );
    filteredProducts = products.filter((product: any) =>
      allowedProductIds.has(String(product._id || product.id))
    );
  }

  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Produits</h2>
      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {filteredProducts.map((product, idx) => (
            <SubcategoryProductCard key={product._id || product.id || idx} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aucun produit disponible pour cette sous-catégorie.</p>
      )}
    </div>
  );
}
