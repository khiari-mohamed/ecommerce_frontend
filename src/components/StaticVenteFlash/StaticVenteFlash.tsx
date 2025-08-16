import React from "react";
import FlashSaleCard from "./flashSaleCard";
import CountdownTimer from "./flasSaleCounter";

function StaticVenteFlash({ products }: { products: any[] }) {
  // Find the soonest promo_expiration_date for the timer (if available)
  const soonestEndDate = products && products.length > 0
    ? products.reduce((soonest: string, p: any) => {
        if (!soonest) return p.promo_expiration_date;
        return new Date(p.promo_expiration_date) < new Date(soonest) ? p.promo_expiration_date : soonest;
      }, "")
    : null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-red-50" aria-labelledby="flash-sales-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6 shadow-lg">
            <span className="text-2xl">⏰</span>
          </div>
          <h2 id="flash-sales-title" className="text-4xl font-bold mb-4" style={{ color: 'rgb(255, 69, 0)' }}>
            Ventes Flash
          </h2>
        </div>
        {/* Timer container */}
        <div className="flex flex-col items-center justify-center mb-12">
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Profitez de nos offres exclusives avant qu&apos;il ne soit trop tard!</p>
          {soonestEndDate && <CountdownTimer endDate={soonestEndDate} />}
        </div>
        {/* Product cards grid */}
        <div className={`grid gap-8 ${
          products && products.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
          products && products.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
          products && products.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {products &&
            products.length > 0 &&
            products.map((product: any) => {
              const safeProduct = { ...product, aroma_ids: Array.isArray(product.aroma_ids) ? product.aroma_ids : [] };
              return <FlashSaleCard key={product?.id} product={safeProduct} />;
            })}
        </div>
      </div>
    </section>
  );
}

export default StaticVenteFlash;
