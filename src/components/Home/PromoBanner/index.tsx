"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/types/banner";
import { getAllBanners } from "@/app/(admin)/dashboard/utils/banners";

function getProductLinkFromBanner(banner, fallback) {
  let slug = banner?.slug;
  if (!slug || typeof slug !== "string" || slug.trim() === "") {
    slug = banner?.id || banner?._id || "";
  }
  const link = slug
    ? `/banner-product-details?slug=${encodeURIComponent(slug)}`
    : fallback.link;
  return link;
}

// Static images for each slot
const staticImages = [
  "/images/promo/hydro.webp",
  "/images/promo/promo-02.png",
  "/images/promo/lipo6.webp",
];

// Fallback static content for each slot
const staticContent = [
  {
    title: "Hydro Whey 1,59 kg Optimum Nutrition",
    heading: "JUSQU'À 30% DE RÉDUCTION",
    description:
      "Protéine hydrolysée ultra-pure pour une absorption rapide et une récupération musculaire optimale. 30 g de protéines par portion.",
    link: "#",
    linkText: "Acheter maintenant",
    bg: "bg-[#F5F5F7]",
    image: staticImages[0],
    imageAlt: "promo img",
    imageWidth: 500,
    imageHeight: 750,
    imageClass: "absolute bottom-0 right-4 lg:right-26 -z-1",
    imageStyle: { bottom: "-30px" },
    textAlign: "left",
    buttonClass:
      "inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5",
  },
  {
    title: "LIPO 6 BLACK ULTRA CONCENTRATE",
    heading: (
      <>
        Jusqu&apos;à <span className="text-orange">40%</span> réduction
      </>
    ),
    description:
      "LIPO 6 BLACK ULTRA CONCENTRATE (60 CAPS) – Brûleur de graisse ultra-puissant pour une perte de poids rapide et efficace.",
    link: "#",
    linkText: "Profitez-en maintenant",
    bg: "bg-[#FFECE1]",
    image: staticImages[2],
    imageAlt: "promo img",
    imageWidth: 200,
    imageHeight: 200,
    imageClass: "absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1",
    textAlign: "text-left",
    buttonClass:
      "inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5",
  },
  {
    title: "Tapis de course motorisé pliable",
    heading: "Entraînement à domicile",
    description: "20 % de réduction",
    link: "#",
    linkText: "Profitez-en maintenant",
    bg: "bg-[#DBF4F3]",
    image: staticImages[1],
    imageAlt: "promo img",
    imageWidth: 241,
    imageHeight: 241,
    imageClass: "absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1",
    textAlign: "text-right",
    buttonClass:
      "inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9",
  },
];

const PromoBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    getAllBanners()
      .then((data) => setBanners(data))
      .catch(() => setBanners([]));
  }, []);

  // Helper to get banner data or fallback to static
  const getBannerSlot = (idx: number) => {
    const banner = banners[idx];
    const fallback = staticContent[idx];
    if (!banner) return fallback;
    const productLink = getProductLinkFromBanner(banner, fallback);

    if (idx === 0) {
      // Big banner: allow dynamic image
      return {
        ...fallback,
        title: banner.title || fallback.title,
        heading:
          banner.promo && banner.prix
            ? `JUSQU'À ${Math.round(
                (1 - Number(banner.promo) / Number(banner.prix)) * 100
              )}% DE RÉDUCTION`
            : fallback.heading,
        description: banner.meta_description_fr || banner.description_fr || fallback.description,
        link: productLink,
        image: banner.cover ? (banner.cover.startsWith("/") ? banner.cover : "/" + banner.cover) : fallback.image,
        imageAlt: banner.alt_cover || fallback.imageAlt,
      };
    } else {
      // Small banners: always use static image, but allow dynamic text/links
      return {
        ...fallback,
        title: banner.title || fallback.title,
        heading:
          banner.promo && banner.prix
            ? (
                <>
                  Jusqu&apos;à{" "}
                  <span className={idx === 1 ? "text-orange" : "text-teal"}>
                    {Math.round(
                      (1 - Number(banner.promo) / Number(banner.prix)) * 100
                    )}
                    %
                  </span>
                  réduction
                </>
              )
            : fallback.heading,
        description: banner.meta_description_fr || banner.description_fr || fallback.description,
        link: productLink,
        // image: always static for small banners
        image: fallback.image,
        imageAlt: fallback.imageAlt,
      };
    }
  };

  // Get slots (always 3, fallback to static if not enough banners)
  const slot0 = getBannerSlot(0);
  const slot1 = getBannerSlot(1);
  const slot2 = getBannerSlot(2);

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Big promo banner */}
        <div
          className={`relative z-1 overflow-hidden rounded-lg ${slot0.bg} py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5`}
        >
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-dark mb-3">
              {slot0.title}
            </span>
            <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
              {slot0.heading}
            </h2>
            <p
              dangerouslySetInnerHTML={{
                __html: slot0.description,
              }}
            />
            <Link
              href={slot0.link}
              className={slot0.buttonClass}
            >
              {slot0.linkText}
            </Link>
          </div>
          <Image
            src={slot0.image}
            alt={slot0.imageAlt}
            className="absolute bottom-0 right-4 lg:right-26 -z-1"
            // Move image 10px up and 20px to the right
            style={{ bottom: '-40px', right: '24px' }}
            width={500}
            height={750}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* Small promo banner 1 - LIPO 6 */}
          <div
            className={`relative z-1 overflow-hidden rounded-lg ${slot1.bg} py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10`}
          >
            <div className="max-w-[60%]">
              <span className="block text-lg text-dark mb-1.5">
                {slot1.title}
              </span>
              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                {slot1.heading}
              </h2>
              <p
                className="font-semibold text-custom-1 text-orange mb-4"
                dangerouslySetInnerHTML={{
                  __html: slot1.description,
                }}
              />
              <Link
                href={slot1.link}
                className={slot1.buttonClass}
              >
                {slot1.linkText}
              </Link>
            </div>
            <Image
              src={slot1.image}
              alt={slot1.imageAlt}
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1"
              width={200}
              height={200}
            />
          </div>

          {/* Small promo banner 2 - Treadmill */}
          <div
            className={`relative z-1 overflow-hidden rounded-lg ${slot2.bg} py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10`}
          >
            <div className="ml-auto max-w-[60%]">
              <span className="block text-lg text-dark mb-1.5">
                {slot2.title}
              </span>
              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                {slot2.heading}
              </h2>
              <p
                className="max-w-[285px] text-custom-sm mb-4"
                dangerouslySetInnerHTML={{
                  __html: slot2.description,
                }}
              />
              <Link
                href={slot2.link}
                className={slot2.buttonClass}
              >
                {slot2.linkText}
              </Link>
            </div>
            <Image
              src={slot2.image}
              alt={slot2.imageAlt}
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1"
              width={241}
              height={241}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;