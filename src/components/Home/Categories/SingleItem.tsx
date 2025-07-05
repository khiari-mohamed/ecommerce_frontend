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
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4 overflow-hidden">
        {item.image?.url ? (
          <Image
            src={item.image.url}
            alt={item.designation}
            width={82}
            height={62}
            className="object-cover w-full h-full"
            unoptimized={process.env.NODE_ENV !== "production"}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
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