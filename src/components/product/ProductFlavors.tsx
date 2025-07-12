import React from "react";
import { Aroma } from "@/types/aroma";

interface ProductFlavorsProps {
  aroma_ids?: string[];
  aromas: Aroma[];
  activeFlavor?: string;
  setActiveFlavor?: (flavor: string) => void;
}

const ProductFlavors: React.FC<ProductFlavorsProps> = ({
  aroma_ids,
  aromas,
  activeFlavor,
  setActiveFlavor,
}) => {
  if (!aroma_ids || aroma_ids.length === 0 || !aromas || aromas.length === 0) return null;

  const matchedAromas = aroma_ids
    .map((id) => aromas.find((aroma) => String(aroma.id) === String(id)))
    .filter((aroma): aroma is Aroma => Boolean(aroma));

  if (matchedAromas.length === 0) return null;

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="flavor-select" className="block mb-1 text-xs font-semibold text-gray-700">
        Choisir une saveur
      </label>
      <select
        id="flavor-select"
        className="block w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        value={activeFlavor || matchedAromas[0]?.designation_fr || ""}
        onChange={e => setActiveFlavor && setActiveFlavor(e.target.value)}
        aria-label="Flavors"
      >
        {matchedAromas.map((aroma) => (
          <option key={aroma._id} value={aroma.designation_fr}>
            {aroma.designation_fr}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFlavors;
