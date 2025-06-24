"use client";
import React, { useEffect, useState } from "react";
import { getProductListPage } from "@/services/products";
import type { Product } from "@/types/product";
import { useSearchParams } from "next/navigation";
import SingleGridItem from "@/components/Shop/SingleGridItem";

const getAllProducts = async (brand?: string) => {
  let products: Product[] = [];
  let query = "";
  if (brand) {
    query = `brand=${brand}`;
  }
  // Get total pages for this brand or all products
  const totalPages = await getProductListPage(query).then(res => res.pagination.totalPages);
  for (let i = 1; i <= totalPages; i++) {
    const pageQuery = query ? `${query}&page=${i}` : `?page=${i}`;
    const res = await getProductListPage(pageQuery);
    products.push(...res.products);
  }
  return products;
};

const AllProductsClient = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const brand = searchParams.get("brand");

  useEffect(() => {
    setLoading(true);
    getAllProducts(brand)
      .then(products => {
        setProducts(products);
      })
      .catch(err => {
        setError("Failed to fetch products: " + (err?.message || err));
      })
      .finally(() => setLoading(false));
  }, [brand]);

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">
        {brand ? `Produits de la marque: ${brand}` : "Tous les produits"}
      </h1>
      {loading && <div>Chargement...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {products.length === 0 && !loading && <div>Aucun produit trouvé.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <SingleGridItem item={product} key={product._id} />
        ))}
      </div>
    </div>
  );
};

export default AllProductsClient;
