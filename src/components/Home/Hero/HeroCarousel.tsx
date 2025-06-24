"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import Image from "next/image";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {/* First Slide (updated to full-width) */}
      <SwiperSlide>
        <div className="relative w-full h-[400px] sm:h-[500px]">
          {/* Full-width background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero/zmb-biotechusa-60-gelules.jpg"
              alt="ZMB Supplement"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          
          {/* Text content overlay */}
          <div className="container mx-auto h-full flex items-center">
            <div className="relative z-10 max-w-[450px] bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg ml-4 sm:ml-12">
              <div className="flex items-center gap-4 mb-5 sm:mb-8">
                <span className="block font-bold text-3xl sm:text-4xl text-[#ff4500]">
                  30%
                </span>
                <span className="block text-[#ff4500] text-lg sm:text-xl font-medium">
                  REMISE
                </span>
              </div>

              <h1 className="font-bold text-dark text-2xl sm:text-4xl mb-4 leading-tight">
                Complément alimentaire en capsule riche en Zinc, magnésium et vitamine B6
              </h1>

              <p className="text-gray-700 text-base sm:text-lg mb-6">
                Formule synergique pour optimiser le taux de testostérone
              </p>

              <a
                href="#"
                className="inline-block font-bold text-white text-lg rounded-md bg-dark hover:bg-[#333] py-3 px-8 transition-colors duration-300"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/* Second Slide (maintained from previous update) */}
      <SwiperSlide>
        <div className="relative w-full h-[400px] sm:h-[500px]">
          <div className="absolute inset-0">
            <Image
              src="/images/hero/slider5.png"
              alt="real mass"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          <div className="container mx-auto h-full flex items-center justify-end">
            <div className="relative z-10 max-w-[450px] bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg mr-4 sm:mr-12">
              <div className="flex items-center gap-4 mb-5 sm:mb-8">
                <span className="block font-bold text-3xl sm:text-4xl text-[#ff4500]">
                  30%
                </span>
                <span className="block text-[#ff4500] text-lg sm:text-xl font-medium">
                  REMISE
                </span>
              </div>

              <h1 className="font-bold text-dark text-2xl sm:text-4xl mb-4 leading-tight">
                Mass Gainer Real Pharm - Real Mass
              </h1>

              <p className="text-gray-700 text-base sm:text-lg mb-6">
                Real Mass 6.8kg est une formule avancée conçue pour soutenir une
                prise de masse musculaire efficace
              </p>

              <a
                href="#"
                className="inline-block font-bold text-white text-lg rounded-md bg-dark hover:bg-[#333] py-3 px-8 transition-colors duration-300"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;