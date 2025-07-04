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
    className="hero-carousel w-full mt-[88px] md:mt-0"
    style={{ width: '100%' }}
    >
      {/* First Slide (updated to full-width) */}
      <SwiperSlide>
      <div className="relative w-full h-[200px] xs:h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      {/* Full-width background image only, no overlay */}
      <div className="absolute inset-0">
      <Image
      src="/images/hero/1.jpg"
      alt="ZMB Supplement"
      fill
      className="object-cover"
      priority
      sizes="100vw"
      />
      </div>
      </div>
      </SwiperSlide>

      {/* Second Slide (maintained from previous update) */}
      <SwiperSlide>
      <div className="relative w-full h-[200px] xs:h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
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
      <div className="container mx-auto h-full flex items-center justify-end px-2 sm:px-0">
      <div className="relative z-10 w-full max-w-[95vw] xs:max-w-[90vw] sm:max-w-[450px] bg-white bg-opacity-90 p-3 xs:p-4 sm:p-8 rounded-lg shadow-lg mr-0 sm:mr-12">
      <div className="flex items-center gap-2 xs:gap-4 mb-3 xs:mb-5 sm:mb-8">
      <span className="block font-bold text-2xl xs:text-3xl sm:text-4xl text-[#ff4500]">
      30%
      </span>
      <span className="block text-[#ff4500] text-base xs:text-lg sm:text-xl font-medium">
      REMISE
      </span>
      </div>
      
      <h1 className="font-bold text-dark text-lg xs:text-xl sm:text-2xl md:text-4xl mb-2 xs:mb-4 leading-tight">
      Mass Gainer Real Pharm - Real Mass
      </h1>
      
      <p className="text-gray-700 text-sm xs:text-base sm:text-lg mb-3 xs:mb-6">
      Real Mass 6.8kg est une formule avancée conçue pour soutenir une
      prise de masse musculaire efficace
      </p>
      
      <a
      href="#"
      className="inline-block font-bold text-white text-base xs:text-lg rounded-md bg-dark hover:bg-[#333] py-2 xs:py-3 px-4 xs:px-8 transition-colors duration-300"
      >
      achetez maintenant
      </a>
      </div>
      </div>
      </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;