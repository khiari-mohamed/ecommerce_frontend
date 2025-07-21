import axios from "@/lib/axios";
import BrandsPageClient from "./BrandsPageClient";

// Helper to fetch brands
async function getBrands() {
  try {
    const res = await axios.get("/brands");
    return res.data || [];
  } catch {
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getBrands();
  return <BrandsPageClient brands={brands} />;
}
