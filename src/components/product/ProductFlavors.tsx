import React from "react";
import { Aroma } from "@/types/aroma";

interface ProductFlavorsProps {
  aroma_ids?: string[];
  aromas: Aroma[];
  activeFlavor?: string;
  setActiveFlavor?: (flavor: string) => void;
}

const flavorColorMap: Record<string, string> = {
  "Citron": "hover:bg-yellow-light hover:text-yellow-dark",
  "Cassis": "hover:bg-purple-100 hover:text-purple-800",
  "Fraise": "hover:bg-pink-100 hover:text-pink-800",
  "Banane": "hover:bg-yellow-light-2 hover:text-yellow-dark",
  "Ananas": "hover:bg-yellow-light hover:text-yellow-dark",
  "Fruit de la passion": "hover:bg-orange-100 hover:text-orange-dark",
  "Abricot": "hover:bg-orange-100 hover:text-orange-dark",
  "Pêche": "hover:bg-orange-100 hover:text-orange-dark",
  "Poire": "hover:bg-green-light-4 hover:text-green-dark",
  "Vanilla": "hover:bg-yellow-light-2 hover:text-yellow-dark",
  "Double chocolat": "hover:bg-gray-7 hover:text-white",
  "Chocolat": "hover:bg-gray-6 hover:text-white",
  "Cookies": "hover:bg-yellow-300 hover:text-yellow-dark",
  "Mojito": "hover:bg-green-light-2 hover:text-green-dark",
  "Coca Cola": "hover:bg-red-light-3 hover:text-red-dark",
  "Caramel": "hover:bg-orange-100 hover:text-orange-dark",
  "Tiramisu": "hover:bg-yellow-light-2 hover:text-yellow-dark",
  "Vanilla + Cheese cake": "hover:bg-yellow-light-2 hover:text-yellow-dark",
  "Biscuit": "hover:bg-yellow-light-2 hover:text-yellow-dark",
  "Mango": "hover:bg-orange-100 hover:text-orange-dark",
  "Vanilla + Orange": "hover:bg-orange-100 hover:text-orange-dark",
  "Orange": "hover:bg-orange-100 hover:text-orange-dark",
  "Watermelon": "hover:bg-pink-200 hover:text-pink-800",
};

const defaultBadge = "bg-gray-2 text-gray-7 hover:bg-gray-3";

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
    <div className="flex flex-wrap gap-2" aria-label="Flavors">
      {matchedAromas.map((aroma) => {
        const isActive = activeFlavor === aroma.designation_fr;
        const colorClass = flavorColorMap[aroma.designation_fr] || "";
        return (
          <button
            type="button"
            key={aroma._id}
            className={`px-4 py-1 rounded-full text-xs font-semibold border shadow transition
              ${defaultBadge}
              ${colorClass}
              ${isActive ? "ring-2 ring-blue-400 border-blue-400 scale-105" : "border-gray-3"}
              hover:ring-2 hover:ring-blue-300 hover:scale-105 focus:outline-none`}
            style={{ cursor: setActiveFlavor ? "pointer" : "default" }}
            onClick={() => setActiveFlavor && setActiveFlavor(aroma.designation_fr)}
            aria-pressed={isActive}
          >
            {aroma.designation_fr}
          </button>
        );
      })}
    </div>
  );
};

export default ProductFlavors;