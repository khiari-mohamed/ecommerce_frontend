"use client";
import React, { useEffect, useState } from "react";
import { getAllSubCategories } from "@/services/subcategories";
import { SubCategory } from "@/types/subcategory";

const ListAllSubcategories = () => {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubcategories() {
      try {
        const data = await getAllSubCategories();
        setSubcategories(data);
      } catch (error) {
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSubcategories();
  }, []);

  if (loading) return <div>Chargement des sous-catégories...</div>;
  if (!subcategories.length) return <div className="text-red-500">Aucune sous-catégorie trouvée.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Toutes les sous-catégories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subcategories.map((subcat) => (
          <div
            key={subcat._id}
            className="bg-white rounded shadow p-4 flex flex-col items-start border hover:shadow-lg transition"
          >
            <span className="font-semibold text-base mb-1">
              {subcat.designation_fr || subcat.designation || subcat.name}
            </span>
            <span className="text-xs text-gray-500 mb-2">({subcat.slug})</span>
            {/* If you want to link to the subcategory page: */}
            <a
              href={`/subcategories/${subcat.slug}`}
              className="text-blue-600 hover:underline text-sm mt-auto"
            >
              Voir la sous-catégorie
            </a>
          </div>
        ))}
      </div>
      <div className="mt-6 text-xs text-gray-400">
        Total: {subcategories.length} sous-catégories
      </div>
    </div>
  );
};

export default ListAllSubcategories;