import { host, storage } from "./const/url";
import React from "react";
import FlashSaleCard from "./flashSaleCard";

function StaticVenteFlash({ products }: { products: any[] }) {
  return (
    <div className="container py-12 mx-auto">
      <h2 className="mb-10 uppercase font-bold text-2xl tracking-wide text-center text-[#ff4000]">
        VENTES FLASH
      </h2>
      <div className="productmarging grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products &&
          products.length > 0 &&
          products.map((product: any) => {
            return <FlashSaleCard key={product?.id} product={product} />;
          })}
      </div>
    </div>
  );
}

export default StaticVenteFlash;