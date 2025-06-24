import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      {/* Full-width Carousel */}
      <div className="mb-5 rounded-none sm:rounded-[10px] bg-white overflow-hidden shadow-sm">
        <HeroCarousel />
      </div>

      {/* Wider Promo Boxes Container (90% width) */}
      <div className="w-[90%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Promo Box 1 */}
          <div className="relative rounded-[10px] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow h-[220px] sm:h-[280px]">
            <div className="flex h-full flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 flex flex-col justify-center h-full">
                <h2 className="font-semibold text-dark text-xl sm:text-2xl mb-4">
                  <a href="#">MICRONIZED CREATINE POWDER – 317G</a>
                </h2>
                <div className="mt-auto">
                  <p className="font-medium text-dark-4 text-sm sm:text-base mb-2">
                    offre à durée limitée!
                  </p>
                  <span className="flex items-center gap-3">
                    <span className="font-medium text-heading-4 text-red">179dt</span>
                    <span className="font-medium text-xl text-dark-4 line-through">200dt</span>
                  </span>
                </div>
              </div>
              <div className="w-40 sm:w-48 h-full flex items-center">
                <Image
                  src="/images/hero/crmono.webp"
                  alt="creatine micronized"
                  width={180}
                  height={230}
                  className="object-contain h-full"
                />
              </div>
            </div>
          </div>

          {/* Promo Box 2 */}
          <div className="relative rounded-[10px] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow h-[220px] sm:h-[280px]">
            <div className="flex h-full flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 flex flex-col justify-center h-full">
                <h2 className="font-semibold text-dark text-xl sm:text-2xl mb-4">
                  <a href="#">HARD MASS GAINER - 7Kg</a>
                </h2>
                <div className="mt-auto">
                  <p className="font-medium text-dark-4 text-sm sm:text-base mb-2">
                    offre à durée limitée!
                  </p>
                  <span className="flex items-center gap-3">
                    <span className="font-medium text-heading-4 text-red">245dt</span>
                    <span className="font-medium text-xl text-dark-4 line-through">280dt</span>
                  </span>
                </div>
              </div>
              <div className="w-40 sm:w-48 h-full flex items-center">
                <Image
                  src="/images/hero/mg.webp"
                  alt="HARD MASS GAINER"
                  width={180}
                  height={230}
                  className="object-contain h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroFeature />
    </section>
  );
};

export default Hero;