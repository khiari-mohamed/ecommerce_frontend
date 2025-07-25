"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { Aroma } from "@/types/aroma";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";


interface ProductItemProps {
  item: Product;
  aromas?: Aroma[]; // Pass the full aromas array as a prop
}

const ProductItem = ({ item, aromas: aromasProp = [] }: ProductItemProps) => {
  // DEBUG: Log the product item to compare BestSeller vs NewArrival
  if (typeof window !== "undefined") {
    // Only log in browser
    // @ts-ignore
    window.__lastProductItem = item;
    // eslint-disable-next-line no-console
    console.log("[ProductItem] item:", item);
  }
  // Fetch aromas if not provided as prop
  const [aromas, setAromas] = React.useState<Aroma[]>(aromasProp);
  React.useEffect(() => {
    if (!aromasProp.length) {
      fetch("/api/aromas")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAromas(data);
          } else if (data && Array.isArray(data.aromas)) {
            setAromas(data.aromas);
          } else {
            setAromas([]);
          }
        })
        .catch(() => setAromas([]));
    }
  }, [aromasProp]);
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // add to cart
  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
        image: ""
      })
    );
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        status: "available",
        quantity: 1,
      })
    );
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

 // Helper to get valid image source
  const getValidImageSrc = (src?: string): string => {
    if (!src || typeof src !== "string" || src.trim() === "") {
      return "/images/placeholder.png";
    }
    let cleanSrc = src.trim().replace(/\\\\/g, "/").replace(/\\/g, "/");

    // If it's an absolute localhost URL, convert to relative
    if (cleanSrc.startsWith("http://localhost") || cleanSrc.startsWith("https://localhost")) {
      // Extract the path after the host
      const url = new URL(cleanSrc);
      cleanSrc = url.pathname;
    }

    // If it's still an absolute URL (external), return as is (but you must configure the domain in next.config.js)
    if (cleanSrc.startsWith("http")) {
      return cleanSrc;
    }

    // Ensure it starts with a slash
    if (!cleanSrc.startsWith("/")) {
      cleanSrc = "/" + cleanSrc;
    }
    return cleanSrc;
  };
  // Get the main image source with fallbacks
  const imageSrc = getValidImageSrc(
    item.cover ||
    item.imgs?.previews?.[0] || 
    item.imgs?.thumbnails?.[0] ||
    item.mainImage?.url
  );

  // Stable fake review count based on product id
  function getFakeReviewCount(id: string | number): number {
    const str = String(id);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i);
    }
    return (hash % 90) + 10;
  }

  return (
    <div className={"group relative flex flex-col h-full bg-white rounded-md overflow-hidden border transition-all duration-300 hover:border-primary/20 hover:shadow-lg"}>
      <div className="relative flex items-center justify-center p-2 sm:p-4 aspect-square bg-gray-50">
        {/* Discount badge */}
        {item.price > item.discountedPrice && (
          <span className="intense-flashing-badge absolute top-2 left-2 z-10 text-xs px-2 py-0.5 bg-[#ef837b] rounded-sm animate-pulse">
            -{Math.round(((item.price - item.discountedPrice) / item.price) * 100)}%
          </span>
        )}
        <Image src={imageSrc} alt={item.title || item.designation || ""} width={250} height={250} className="object-contain h-full w-auto max-w-full transition-all duration-500" />

        <div className="absolute right-0 -bottom-6 sm:-bottom-6 -bottom-14 translate-x-full w-full flex flex-row flex-nowrap gap-2 p-5.5 ease-linear duration-300 group-hover:translate-x-0 overflow-x-auto z-20">
          <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            id="newOne"
            aria-label="button for quick view"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            {/* ...SVG omitted for brevity... */}
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00016 5.5C6.61945 5.5 5.50016 6.61929 5.50016 8C5.50016 9.38071 6.61945 10.5 8.00016 10.5C9.38087 10.5 10.5002 9.38071 10.5002 8C10.5002 6.61929 9.38087 5.5 8.00016 5.5ZM6.50016 8C6.50016 7.17157 7.17174 6.5 8.00016 6.5C8.82859 6.5 9.50016 7.17157 9.50016 8C9.50016 8.82842 8.82859 9.5 8.00016 9.5C7.17174 9.5 6.50016 8.82842 6.50016 8Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00016 2.16666C4.99074 2.16666 2.96369 3.96946 1.78721 5.49791L1.76599 5.52546C1.49992 5.87102 1.25487 6.18928 1.08862 6.5656C0.910592 6.96858 0.833496 7.40779 0.833496 8C0.833496 8.5922 0.910592 9.03142 1.08862 9.4344C1.25487 9.81072 1.49992 10.129 1.76599 10.4745L1.78721 10.5021C2.96369 12.0305 4.99074 13.8333 8.00016 13.8333C11.0096 13.8333 13.0366 12.0305 14.2131 10.5021L14.2343 10.4745C14.5004 10.129 14.7455 9.81072 14.9117 9.4344C15.0897 9.03142 15.1668 8.5922 15.1668 8C15.1668 7.40779 15.0897 6.96858 14.9117 6.5656C14.7455 6.18927 14.5004 5.87101 14.2343 5.52545L14.2131 5.49791C13.0366 3.96946 11.0096 2.16666 8.00016 2.16666ZM2.57964 6.10786C3.66592 4.69661 5.43374 3.16666 8.00016 3.16666C10.5666 3.16666 12.3344 4.69661 13.4207 6.10786C13.7131 6.48772 13.8843 6.7147 13.997 6.9697C14.1023 7.20801 14.1668 7.49929 14.1668 8C14.1668 8.50071 14.1023 8.79199 13.997 9.0303C13.8843 9.28529 13.7131 9.51227 13.4207 9.89213C12.3344 11.3034 10.5666 12.8333 8.00016 12.8333C5.43374 12.8333 3.66592 11.3034 2.57964 9.89213C2.28725 9.51227 2.11599 9.28529 2.00334 9.0303C1.89805 8.79199 1.8335 8.50071 1.8335 8C1.8335 7.49929 1.89805 7.20801 2.00334 6.9697C2.11599 6.7147 2.28725 6.48772 2.57964 6.10786Z"
                fill=""
              />
            </svg>
          </button>

          <button
            onClick={() => handleAddToCart()}
            className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] text-white ease-out duration-200" style={{ backgroundColor: '#FF4500' }}
          >
            Ajouter au panier
          </button>

          <button
            onClick={() => handleItemToWishList()}
            aria-label="button for favorite select"
            id="favOne"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            {/* ...SVG omitted for brevity... */}
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.74949 2.94946C2.6435 3.45502 1.83325 4.65749 1.83325 6.0914C1.83325 7.55633 2.43273 8.68549 3.29211 9.65318C4.0004 10.4507 4.85781 11.1118 5.694 11.7564C5.89261 11.9095 6.09002 12.0617 6.28395 12.2146C6.63464 12.491 6.94747 12.7337 7.24899 12.9099C7.55068 13.0862 7.79352 13.1667 7.99992 13.1667C8.20632 13.1667 8.44916 13.0862 8.75085 12.9099C9.05237 12.7337 9.3652 12.491 9.71589 12.2146C9.90982 12.0617 10.1072 11.9095 10.3058 11.7564C11.142 11.1118 11.9994 10.4507 12.7077 9.65318C13.5671 8.68549 14.1666 7.55633 14.1666 6.0914C14.1666 4.65749 13.3563 3.45502 12.2503 2.94946C11.1759 2.45832 9.73214 2.58839 8.36016 4.01382C8.2659 4.11175 8.13584 4.16709 7.99992 4.16709C7.864 4.16709 7.73393 4.11175 7.63967 4.01382C6.26769 2.58839 4.82396 2.45832 3.74949 2.94946ZM7.99992 2.97255C6.45855 1.5935 4.73256 1.40058 3.33376 2.03998C1.85639 2.71528 0.833252 4.28336 0.833252 6.0914C0.833252 7.86842 1.57358 9.22404 2.5444 10.3172C3.32183 11.1926 4.2734 11.9253 5.1138 12.5724C5.30431 12.7191 5.48911 12.8614 5.66486 12.9999C6.00636 13.2691 6.37295 13.5562 6.74447 13.7733C7.11582 13.9903 7.53965 14.1667 7.99992 14.1667C8.46018 14.1667 8.88401 13.9903 9.25537 13.7733C9.62689 13.5562 9.99348 13.2691 10.335 12.9999C10.5107 12.8614 10.6955 12.7191 10.886 12.5724C11.7264 11.9253 12.678 11.1926 13.4554 10.3172C14.4263 9.22404 15.1666 7.86842 15.1666 6.0914C15.1666 4.28336 14.1434 2.71528 12.6661 2.03998C11.2673 1.40058 9.54129 1.5935 7.99992 2.97255Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-row flex-nowrap items-center justify-center gap-2 mb-2 mt-2">
        <div className="flex flex-row flex-nowrap items-center gap-1">
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <span className="text-custom-sm ml-1">
            {`(${(item.reviews?.length && item.reviews.length > 0)
              ? item.reviews.length
              : getFakeReviewCount(item._id || item.id)})`}
          </span>
        </div>
      </div>

      <h3
        className="mb-2.5 text-sm font-medium text-center w-full transition-colors sm:text-base line-clamp-2 group-hover:text-primary"
        onClick={() => handleProductDetails()}
      >
        <Link href={`/product-details?id=${item._id || item.id}`}>{item.title || item.designation || item.designation_fr || "Produit"}</Link>
      </h3>

      <div className="flex flex-row flex-nowrap items-center justify-center gap-2 mb-3">
        <span className="text-base font-semibold text-[#EF837B]">
          {Number(item.discountedPrice).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
        </span>
        <span className="mt-1 text-sm text-gray-400 line-through">
          {Number(item.price).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}
        </span>
      </div>
    </div>
  );
};

export default ProductItem;