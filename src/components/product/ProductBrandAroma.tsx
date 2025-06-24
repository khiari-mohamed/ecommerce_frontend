
import React, { useEffect, useState } from "react";
import { Brand } from "@/types/brand";
import { Aroma } from "@/types/aroma";
import { getBrandById } from "@/services/brand";
import { getAromasByBrand } from "@/services/aroma";

interface ProductBrandAromaProps {
  brandId: string;
}

// Helper: check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

const ProductBrandAroma: React.FC<ProductBrandAromaProps> = ({ brandId }) => {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [aromas, setAromas] = useState<Aroma[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Only fetch if brandId is valid
    if (!brandId || !isValidObjectId(brandId)) {
      setBrand(null);
      setAromas([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      getBrandById(brandId),
      getAromasByBrand(brandId),
    ])
      .then(([brandData, aromasData]) => {
        if (isMounted) {
          setBrand(brandData);
          setAromas(aromasData);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setBrand(null);
          setAromas([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [brandId]);

  if (!brandId || !isValidObjectId(brandId)) {
    // Don't render anything if no valid brandId
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="mb-4">
      {brand && (
        <div className="flex items-center gap-2 mb-2">
          {brand.logo && (
            <img
              src={brand.logo}
              alt={brand.designation_fr}
              className="w-8 h-8 object-contain rounded bg-white border"
            />
          )}
          <span className="font-semibold text-blue-700 text-sm">
            {brand.designation_fr}
          </span>
        </div>
      )}
      {aromas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {aromas.map((aroma) => (
            <span
              key={aroma._id}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-100"
            >
              {aroma.designation_fr}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductBrandAroma;
