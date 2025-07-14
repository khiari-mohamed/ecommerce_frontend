// src/components/Home/Categories/SingleItem.tsx
import { Category } from "@/types/category";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }: { item: Category }) => {
  return (
    <Link
      href={`/categories/${item.slug}`}
      className="group flex flex-col items-center"
      passHref
    >
      <div className="w-[150px] h-[150px] rounded-full flex items-center justify-center mb-4 bg-[#FF4500] shadow-lg transition-transform duration-300 group-hover:bounce-custom">
        {item.image?.url ? (
          <img
            src={item.image.url}
            alt={item.designation}
            width={90}
            height={90}
            className="icon-white w-[90px] h-[90px] object-contain"
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