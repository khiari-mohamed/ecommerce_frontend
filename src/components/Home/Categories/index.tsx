"use client";
import { useEffect, useState } from "react";
import SingleItem from "./SingleItem";
import { getCategories } from "@/services/categories";
import { Category } from "@/types/category";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import categoryData from './categoryData';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        
        // Merge static data with database data
        const mergedData = data.map((dbCategory: Category) => {
          const staticCategory = categoryData.find(
            (staticCat) => dbCategory.id !== undefined && staticCat.id === dbCategory.id.toString()
          );

          return {
            ...dbCategory,
            // Use static title if available, otherwise fall back to designation_fr or designation
            title: staticCategory?.title || dbCategory.designation_fr || dbCategory.designation,
            // Use static image if available, otherwise use database image
            image: {
              url: staticCategory?.img || dbCategory.image?.url || '',
              img_id: dbCategory.image?.img_id || ''
            }
          };
        });

        setCategories(mergedData);
      } catch (err) {
        setError("Failed to load categories");
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="overflow-hidden pt-17.5">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <Skeleton width={150} height={25} />
              <Skeleton width={200} height={30} />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton circle width={40} height={40} />
              <Skeleton circle width={40} height={40} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton circle width={130} height={130} />
                <Skeleton width={80} height={20} className="mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden pt-17.5">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
          <div className="text-red-500 text-center py-10">{error}</div>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return (
      <section className="overflow-hidden pt-17.5">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
          <div className="text-gray-500 text-center py-10">No categories found</div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-16 sm:pb-15 border-b border-gray-3">
        <div className="mb-6 sm:mb-10">
          <h2
            className="font-semibold text-xl xl:text-heading-5 text-center"
            style={{ color: '#FF4500' }}
          >
            Parcourir par catégorie
          </h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-6 lg:gap-8">
          {categories.map((category) => (
            <div key={category._id} className="w-full">
              <SingleItem item={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;