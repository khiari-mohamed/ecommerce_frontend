import { Product } from "@/types/product";

// Fetch all products
export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Bulk create products
export async function createProductsBulk(products: Product[]): Promise<any> {
  const res = await fetch("http://localhost:5000/products/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(products),
  });
  if (!res.ok) throw new Error("Bulk import failed");
  return res.json();
}