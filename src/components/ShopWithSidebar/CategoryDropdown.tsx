
"use client";
import { useState, useEffect } from "react";
import { getCategories } from "@/services/categories";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { SubCategory } from "@/types/subcategory";
import Skeleton from "react-loading-skeleton";

interface CategoryDropdownProps {
  selectedCategories: string[];
  onCategorySelect: (id: string) => void;
  products: Product[];
  subcategories: SubCategory[];
}

const CategoryItem = ({
  category,
  selected,
  onSelect,
  productCount,
}: {
  category: Category;
  selected: boolean;
  onSelect: (id: string) => void;
  productCount: number;
}) => {
  return (
    <button
      type="button"
      className={`${
        selected && "text-blue"
      } group flex items-center justify-between ease-out duration-200 hover:text-blue w-full`}
      onClick={() => onSelect(category._id)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
            selected ? "border-blue bg-blue" : "bg-white border-gray-3"
          }`}
        >
          <svg
            className={selected ? "block" : "hidden"}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="white"
              strokeWidth="1.94437"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-left">{category.designation}</span>
      </div>
      <span
        className={`${
          selected ? "text-white bg-blue" : "bg-gray-2"
        } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {productCount}
      </span>
    </button>
  );
};

const CategoryDropdown = ({
  selectedCategories = [],
  onCategorySelect,
  products,
  subcategories,
}: CategoryDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper: get all subcategory ids for a category (robust string compare)
  const getSubcategoryIdsForCategory = (category: Category) =>
    subcategories
      .filter((subcat) => String(subcat.categorie_id) === String(category.id))
      .map((subcat) => String(subcat.id));

  // Helper: count products for a category via subcategories (robust string compare)
  const getProductCountForCategory = (category: Category) => {
    const subcategoryIds = getSubcategoryIdsForCategory(category);
    return products.filter(
      (prod) =>
        prod.sous_categorie_id &&
        subcategoryIds.includes(String(prod.sous_categorie_id))
    ).length;
  };

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark">Catégories</p>
        <button
          aria-label="button for category dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && "rotate-180"
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton width={16} height={16} circle />
              <Skeleton width={100} height={16} />
              <Skeleton width={30} height={16} className="ml-auto" />
            </div>
          ))
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : categories.length === 0 ? (
          <div className="text-gray-500 text-sm">Aucune catégorie trouvée</div>
        ) : (
          categories.map((category) => (
            <CategoryItem
              key={category._id}
              category={category}
              selected={selectedCategories.includes(category._id)}
              onSelect={onCategorySelect}
              productCount={getProductCountForCategory(category)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;
