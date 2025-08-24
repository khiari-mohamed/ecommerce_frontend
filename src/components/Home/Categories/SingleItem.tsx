// src/components/Home/Categories/SingleItem.tsx
import { Category } from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import { getEnhancedCategoryImageSrc, shouldUnoptimizeNonProductImage } from "@/utils/nonProductImage";

const SingleItem = ({ item }: { item: Category }) => {
  const categoryImageSrc = getEnhancedCategoryImageSrc(item);
  const hasImage = categoryImageSrc && categoryImageSrc !== '/images/placeholder.png';
  
  return (
    <Link
      href={`/categories/${item.slug}`}
      className="group flex flex-col items-center"
      passHref
    >
      <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full flex items-center justify-center mb-3 sm:mb-4 bg-[#FF4500] shadow-lg transition-transform duration-300 group-hover:bounce-custom">
        {hasImage ? (
          <img
            src={categoryImageSrc}
            alt={item.designation}
            width={90}
            height={90}
            className="icon-white w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
            <span className="text-gray-500">Aucune image</span>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {item.designation}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;