"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useMemo } from "react";
import "swiper/css/navigation";
import "swiper/css";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";

// Helper to ensure only local images or fallback to placeholder
function getValidImageSrc(src?: string): string {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return "/images/placeholder.png";
  }
  let cleanSrc = src.trim().replace(/\\\\/g, "/").replace(/\\/g, "/");
  if (cleanSrc.startsWith("http")) {
    return cleanSrc;
  }
  if (!cleanSrc.startsWith("/")) {
    cleanSrc = "/" + cleanSrc;
  }
  return cleanSrc;
}

// Robust image selection logic (same as ProductCard/BestSeller)
function getProductImageCandidates(item: any): string[] {
  const candidates: string[] = [];
  if (typeof item?.cover === "string" && item.cover.trim() !== "") candidates.push(item.cover);
  if (item?.imgs?.previews?.length && item.imgs.previews[0]) candidates.push(item.imgs.previews[0]);
  if (item?.imgs?.thumbnails?.length && item.imgs.thumbnails[0]) candidates.push(item.imgs.thumbnails[0]);
  if (item?.mainImage && typeof item.mainImage === "object" && item.mainImage.url) candidates.push(item.mainImage.url);
  if (Array.isArray(item?.images) && item.images.length > 0 && item.images[0]?.url) candidates.push(item.images[0].url);
  // Remove duplicates and invalids
  return candidates
    .map(getValidImageSrc)
    .filter((src, idx, arr) => src !== "/images/placeholder.png" && !!src && arr.indexOf(src) === idx);
}

const PreviewSliderModal = () => {
  const { closePreviewModal, isModalPreviewOpen } = usePreviewSlider();
  const rawData = useAppSelector((state) => state.productDetailsReducer.value);

  // Normalize product fields for consistent UI usage (robust normalization)
  const data = useMemo(() => {
    if (!rawData) return null;
    return {
      ...rawData,
      imgs: rawData.imgs && rawData.imgs.thumbnails?.length > 0 && rawData.imgs.previews?.length > 0
        ? rawData.imgs
        : {
            thumbnails: (
              rawData.images && Array.isArray(rawData.images) && rawData.images.length > 0
                ? rawData.images.map((img: any) => img.url)
                : rawData.mainImage?.url
                ? [rawData.mainImage.url]
                : []
            ),
            previews: (
              rawData.images && Array.isArray(rawData.images) && rawData.images.length > 0
                ? rawData.images.map((img: any) => img.url)
                : rawData.mainImage?.url
                ? [rawData.mainImage.url]
                : []
            ),
          },
      mainImage: rawData.mainImage || { url: rawData.cover || "" },
      cover: rawData.cover || rawData.mainImage?.url || "",
      price: Number(rawData.prix ?? rawData.price) || 0,
      discountedPrice: Number(rawData.promo ?? rawData.discountedPrice) || Number(rawData.prix ?? rawData.price) || 0,
      title: rawData.title || rawData.designation_fr || rawData.designation || "Produit",
      reviews: rawData.reviews || 0,
    };
  }, [rawData]);

  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  // Get images array from data (robust logic)
  const images = useMemo(() => {
    if (!data) return [];
    const candidates = getProductImageCandidates(data);
    return candidates.length > 0 ? candidates : ["/images/placeholder.png"];
  }, [data]);

  return (
    <div
      className={`preview-slider w-full h-screen z-999999 inset-0 flex justify-center items-center bg-[#000000F2] bg-opacity-70 ${
        isModalPreviewOpen ? "fixed" : "hidden"
      }`}
    >
      <button
        onClick={() => closePreviewModal()}
        aria-label="button for close modal"
        className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 text-white hover:text-meta-5 z-10"
      >
        {/* ...close SVG... */}
        <svg
          className="fill-current"
          width="36"
          height="36"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
            fill=""
          />
        </svg>
      </button>

      <div>
        <button
          className="rotate-180 absolute left-100 p-5 cursor-pointer z-10 "
          onClick={handlePrev}
        >
          {/* ...prev SVG... */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.5918 5.92548C14.9091 5.60817 15.4236 5.60817 15.7409 5.92548L22.2409 12.4255C22.5582 12.7428 22.5582 13.2572 22.2409 13.5745L15.7409 20.0745C15.4236 20.3918 14.9091 20.3918 14.5918 20.0745C14.2745 19.7572 14.2745 19.2428 14.5918 18.9255L19.7048 13.8125H4.33301C3.88428 13.8125 3.52051 13.4487 3.52051 13C3.52051 12.5513 3.88428 12.1875 4.33301 12.1875H19.7048L14.5918 7.07452C14.2745 6.75722 14.2745 6.24278 14.5918 5.92548Z"
              fill="#FDFDFD"
            />
          </svg>
        </button>

        <button
          className="absolute right-100 p-5 cursor-pointer z-10"
          onClick={handleNext}
        >
          {/* ...next SVG... */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.5918 5.92548C14.9091 5.60817 15.4236 5.60817 15.7409 5.92548L22.2409 12.4255C22.5582 12.7428 22.5582 13.2572 22.2409 13.5745L15.7409 20.0745C15.4236 20.3918 14.9091 20.3918 14.5918 20.0745C14.2745 19.7572 14.2745 19.2428 14.5918 18.9255L19.7048 13.8125H4.33301C3.88428 13.8125 3.52051 13.4487 3.52051 13C3.52051 12.5513 3.88428 12.1875 4.33301 12.1875H19.7048L14.5918 7.07452C14.2745 6.75722 14.2745 6.24278 14.5918 5.92548Z"
              fill="#FDFDFD"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center w-full">
        <Swiper ref={sliderRef} slidesPerView={1} spaceBetween={20}>
          {images.length > 0 ? (
            images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-col items-center w-full">
                  <div className="flex justify-center items-center w-full">
                    <Image
                      src={img}
                      alt={`product image ${idx + 1}`}
                      width={450}
                      height={450}
                      className="object-contain w-full max-w-[95vw] max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] h-auto rounded bg-white"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 450px"
                    />
                  </div>
                  {/* Product Title */}
                  <h3 className="mt-4 mb-2 text-lg sm:text-xl font-semibold text-white text-center px-2 break-words">
                    {data?.title}
                  </h3>
                  {/* Product Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base sm:text-lg font-bold text-white">
                      {Number(data?.discountedPrice).toLocaleString("fr-TN", {
                        style: "currency",
                        currency: "TND",
                      })}
                    </span>
                    {data?.discountedPrice !== data?.price && (
                      <span className="text-sm sm:text-base line-through text-gray-300">
                        {Number(data?.price).toLocaleString("fr-TN", {
                          style: "currency",
                          currency: "TND",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="flex flex-col items-center w-full">
                <Image
                  src="/images/placeholder.png"
                  alt="No image"
                  width={450}
                  height={450}
                  className="object-cover w-full max-w-[95vw] max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] h-auto rounded"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 450px"
                />
                <h3 className="mt-4 mb-2 text-lg sm:text-xl font-semibold text-white text-center px-2 break-words">
                  {data?.title}
                </h3>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default PreviewSliderModal;