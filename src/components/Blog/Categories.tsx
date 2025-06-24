import React from "react";
import { Category as BaseCategory } from "@/types/category";

// Extend Category type to allow productsCount for frontend robustness
interface Category extends BaseCategory {
  productsCount?: number;
}

interface CategoriesProps {
  categories?: Category[]; // Make optional for debugging
}

const Categories = ({ categories }: CategoriesProps) => {
  console.log('Categories received:', categories); // Debug log

  if (!categories || categories.length === 0) {
    return (
      <div className="shadow-1 bg-white rounded-xl mt-7.5 p-6">
        <h2 className="font-medium text-lg text-dark mb-2">Catégories populaires</h2>
        <p className="text-gray-500">Aucune catégorie</p>
      </div>
    );
  }

  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">Catégories populaires</h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-3">
          {categories.map((category) => (
            <a
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group flex items-center justify-between ease-out duration-200 text-dark hover:text-blue"
            >
              {category.designation_fr || category.designation}
              <span className="inline-flex rounded-[30px] bg-gray-2 text-custom-xs px-1.5 ease-out duration-200 group-hover:text-white group-hover:bg-blue">
                {category.products?.length || 0}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;