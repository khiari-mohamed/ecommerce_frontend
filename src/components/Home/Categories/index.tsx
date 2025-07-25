"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect, useState } from "react";
import "swiper/css/navigation";
import "swiper/css";
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
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current || !('swiper' in sliderRef.current)) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current || !('swiper' in sliderRef.current)) return;
    sliderRef.current.swiper.slideNext();
  }, []);

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
          <div className="flex gap-4">
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
      <div className="w-full mx-auto px-2 sm:px-4 pb-10 sm:pb-15 border-b border-gray-3">
        <div className="swiper categories-carousel common-carousel">
          <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div className="w-full flex justify-center">
              <h2
                className="font-semibold text-xl xl:text-heading-5 w-full text-center !flex !justify-center"
                style={{ color: '#FF4500', display: 'flex', justifyContent: 'center', width: '100%' }}
              >
                Parcourir par catégorie
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="swiper-button-prev">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.875 10H3.125"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.75 4.375L3.125 10L8.75 15.625"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button onClick={handleNext} className="swiper-button-next">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.125 10H16.875"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.25 4.375L16.875 10L11.25 15.625"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <Swiper
            ref={sliderRef}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              0: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 6 },
              1536: { slidesPerView: 6 },
            }}
            style={{ width: "100%" }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id}>
                <SingleItem item={category} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Categories;