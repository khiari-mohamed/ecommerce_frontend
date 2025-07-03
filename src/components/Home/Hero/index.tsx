import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-20 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      {/* Full-width Carousel */}
      <div className="mb-5 rounded-none sm:rounded-[10px] bg-white overflow-hidden shadow-sm">
        <HeroCarousel />
      </div>

      {/* Wider Promo Boxes Container (90% width) */}
      <div className="w-full sm:w-[90%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Promo Box 1 */}
          <div className="relative rounded-[10px] bg-white p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow min-h-[180px] sm:min-h-[220px] lg:min-h-[280px] h-auto">
            <div className="flex h-full flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex-1 flex flex-col justify-center h-full w-full">
                <h2 className="font-semibold text-dark text-base sm:text-xl lg:text-2xl mb-2 sm:mb-4 text-center sm:text-left">
                  <a href="#">MICRONIZED CREATINE POWDER – 317G</a>
                </h2>
                <div className="mt-auto">
                  <p className="font-medium text-dark-4 text-xs sm:text-sm lg:text-base mb-1 sm:mb-2 text-center sm:text-left">
                    offre à durée limitée!
                  </p>
                  <span className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                    <span className="font-medium text-lg sm:text-heading-4 text-red">179dt</span>
                    <span className="font-medium text-base sm:text-xl text-dark-4 line-through">200dt</span>
                  </span>
                </div>
              </div>
              <div className="w-24 sm:w-40 lg:w-48 h-24 sm:h-40 lg:h-48 flex items-center justify-center mx-auto">
                <Image
                  src="/images/hero/crmono.webp"
                  alt="creatine micronized"
                  width={180}
                  height={230}
                  className="object-contain h-full w-full"
                />
              </div>
            </div>
          </div>

          {/* Promo Box 2 */}
          <div className="relative rounded-[10px] bg-white p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow min-h-[180px] sm:min-h-[220px] lg:min-h-[280px] h-auto mt-4 sm:mt-0">
            <div className="flex h-full flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex-1 flex flex-col justify-center h-full w-full">
                <h2 className="font-semibold text-dark text-base sm:text-xl lg:text-2xl mb-2 sm:mb-4 text-center sm:text-left">
                  <a href="#">HARD MASS GAINER - 7Kg</a>
                </h2>
                <div className="mt-auto">
                  <p className="font-medium text-dark-4 text-xs sm:text-sm lg:text-base mb-1 sm:mb-2 text-center sm:text-left">
                    offre à durée limitée!
                  </p>
                  <span className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                    <span className="font-medium text-lg sm:text-heading-4 text-red">245dt</span>
                    <span className="font-medium text-base sm:text-xl text-dark-4 line-through">280dt</span>
                  </span>
                </div>
              </div>
              <div className="w-24 sm:w-40 lg:w-48 h-24 sm:h-40 lg:h-48 flex items-center justify-center mx-auto">
                <Image
                  src="/images/hero/mg.webp"
                  alt="HARD MASS GAINER"
                  width={180}
                  height={230}
                  className="object-contain h-full w-full"
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