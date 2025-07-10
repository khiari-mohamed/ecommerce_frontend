import React, { useState } from "react";
import Link from "next/link";

interface Subcategory {
  _id?: string;
  id?: number;
  slug: string;
  designation_fr: string;
  name?: string;
}

interface Category {
  _id?: string;
  id?: number;
  slug: string;
  designation_fr: string;
  name?: string;
  subcategories?: Subcategory[];
  sous_categories?: Subcategory[];
}

interface Props {
  categories: Category[];
}

const CategoriesDropdown: React.FC<Props> = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Normalize subcategories for compatibility
  const getSubcategories = (cat: Category) =>
    cat.subcategories || cat.sous_categories || [];

  return (
    <li className="group relative">
      <button
        type="button"
        className="flex items-center justify-between w-full py-2 px-3 md:w-auto"
      >
        <svg viewBox="0 0 150 80" width="40" height="40">
          <rect width="100" height="20"></rect>
          <rect y="30" width="100" height="20"></rect>
          <rect y="60" width="100" height="20"></rect>
        </svg>
        <span className="group relative headermenu1">
          <span className="absolute -bottom-1 capitalize h-0.5 left-0 w-0 group-hover:w-full bg-black transition-all duration-200 ease-linear"></span>
          CATEGORIES
        </span>
      </button>
      {/* Dropdown menu */}
      <div className="absolute z-10 left-0 w-auto hidden group-hover:flex p-4 bg-gray-100 border border-gray-100 rounded-lg shadow-lg" style={{ width: '600px' }}>
        <div className="flex justify-between w-full">
          {/* Main Categories */}
          <div className="w-1/2">
            {categories.map((cat, index) => (
              <div key={cat._id || cat.id || index}>
                <div
                  className="py-1 cursor-pointer"
                  onMouseEnter={() => setActiveCategory(cat)}
                >
                  <Link
                    aria-label={cat.designation_fr || cat.name}
                    className={`font-bold ${activeCategory === cat ? "colorcategory" : "text-black"}`}
                    href={`/categories/${cat.slug || cat.id}`}
                  >
                    {cat.designation_fr || cat.name}
                  </Link>
                  <svg
                    fill="#000000"
                    height="20px"
                    width="20px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="svgheader"
                  >
                    <g>
                      <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12" />
                    </g>
                  </svg>
                </div>
                {index < categories.length - 1 && <div className="border-b border-gray-100 my-2"></div>}
              </div>
            ))}
          </div>
          {/* Divider Line between Categories and Subcategories */}
          <div className="border-l border-gray-300"></div>
          {/* Subcategories */}
          <div className="w-1/2 p-4">
            {activeCategory && getSubcategories(activeCategory).length > 0 ? (
              <ul>
                {getSubcategories(activeCategory).map((sous_category, subIndex) => (
                  <li key={sous_category._id || sous_category.id || subIndex}>
                    <div className="py-1">
                      <Link
                        className="hover:text-red-400 transition-all duration-300 ease-linear"
                        href={`/subcategories/${sous_category.slug}`}
                      >
                        {sous_category.designation_fr || sous_category.name}
                      </Link>
                    </div>
                    {subIndex < getSubcategories(activeCategory).length - 1 && (
                      <div className="border-b border-gray-100 my-2"></div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">Sélectionnez une catégorie</div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default CategoriesDropdown;
