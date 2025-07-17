import React from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "@/lib/axios";

// Helper to fetch up to 3 products for a brand
async function getBrandProducts(brandId: string) {
  try {
    const res = await axios.get(`/products?brand=${brandId}&limit=3`);
    return Array.isArray(res.data?.data?.products) ? res.data.data.products : [];
  } catch {
    return [];
  }
}

async function getBrandsWithProducts() {
  try {
    const res = await axios.get("/brands");
    const brands = res.data || [];
    // Fetch up to 3 products for each brand (in parallel, but limit to 12 brands for demo/perf)
    const brandsToShow = brands.slice(0, 12); // Adjust as needed
    const brandsWithProducts = await Promise.all(
      brandsToShow.map(async (brand: any) => {
        const products = await getBrandProducts(brand.id);
        return { ...brand, products };
      })
    );
    return brandsWithProducts;
  } catch {
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getBrandsWithProducts();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-900 tracking-tight">Toutes les marques</h1>
      <div className="w-24 h-1 bg-[#FF4500] mx-auto mb-10 rounded-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {brands.length === 0 && <div className="col-span-full text-center text-gray-500">Aucune marque trouvée.</div>}
        {brands.map((brand: any) => (
          <div
            key={brand._id || brand.slug}
            className="group relative flex flex-col items-center bg-white rounded-2xl shadow-md border border-gray-100 hover:border-[#FF4500] hover:shadow-lg transition-all duration-200 p-6 pt-8"
            style={{ minHeight: 340 }}
          >
            <Link href={`/brands/${brand.slug}`} className="block w-full flex flex-col items-center">
              <div className="w-24 h-24 mb-3 flex items-center justify-center bg-gray-50 rounded-full border-2 border-[#FF4500] group-hover:shadow-lg overflow-hidden transition-all">
                <Image
                  src={brand.logo ? `/images/brand/${brand.logo}` : "/images/placeholder.svg"}
                  alt={brand.designation_fr}
                  width={96}
                  height={96}
                  className="object-contain w-20 h-20"
                  loading="lazy"
                />
              </div>
              <div className="text-lg font-bold text-gray-900 group-hover:text-[#FF4500] text-center mb-2 truncate w-full">
                {brand.designation_fr}
              </div>
            </Link>
            {/* Featured Products */}
            {brand.products && brand.products.length > 0 && (
              <div className="w-full mt-2">
                <div className="text-xs font-semibold text-gray-500 mb-1 text-center">Produits phares</div>
                <div className="flex flex-row gap-2 justify-center">
                  {brand.products.map((product: any) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      className="block bg-white border border-gray-200 rounded-lg p-1 shadow-sm hover:border-[#FF4500] hover:shadow-md transition-all w-16 h-16 flex items-center justify-center"
                      title={product.designation_fr}
                    >
                      <Image
                        src={product.cover ? (product.cover.startsWith("http") ? product.cover : `/${product.cover}`) : "/images/placeholder.svg"}
                        alt={product.designation_fr}
                        width={56}
                        height={56}
                        className="object-contain w-14 h-14"
                        loading="lazy"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Orange accent graphic */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#FF4500] rounded-b-full opacity-80" />
          </div>
        ))}
      </div>
    </div>
  );
}
