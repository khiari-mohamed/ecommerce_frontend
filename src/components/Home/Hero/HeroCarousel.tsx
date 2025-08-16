"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import Image from "next/image";

const HeroCarousal = () => {
  return (
    <>
      {/* Desktop Swiper - only shows on PC */}
      <div className="hidden sm:block w-full">
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
          <SwiperSlide>
            <div className="relative w-full h-[90vh] max-h-screen">
              <div className="absolute inset-0">
                <img
                  src="/images/hero/slides/sld1.jpg"
                  alt="slide 1 desktop"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[90vh] max-h-screen">
              <div className="absolute inset-0">
                <img
                  src="/images/hero/slides/sld2.jpg"
                  alt="slide 2 desktop"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[90vh] max-h-screen">
              <div className="absolute inset-0">
                <img
                  src="/images/hero/slides/sld3.jpg"
                  alt="slide 3 desktop"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[90vh] max-h-screen">
              <div className="absolute inset-0">
                <img
                  src="/images/hero/slides/sld4.jpg"
                  alt="slide 4 desktop"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative w-full h-[90vh] max-h-screen">
              <div className="absolute inset-0">
                <img
                  src="/images/hero/slides/4.webp"
                  alt="slide 5 desktop"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Mobile Swiper - only shows on mobile */}
      <div className="block sm:hidden w-full h-screen">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          className="hero-carousel h-full"
        >
          <SwiperSlide className="h-screen">
            <div className="relative w-full h-screen">
              <img
                src="/images/hero/slides/1m.webp"
                alt="slide 1 mobile"
                className="object-cover w-full h-screen"
                style={{ minHeight: '100vh', height: '100vh' }}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className="h-screen">
            <div className="relative w-full h-screen">
              <img
                src="/images/hero/slides/2m.webp"
                alt="slide 2 mobile"
                className="object-cover w-full h-screen"
                style={{ minHeight: '100vh', height: '100vh' }}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className="h-screen">
            <div className="relative w-full h-screen">
              <img
                src="/images/hero/slides/4m.webp"
                alt="slide 4 mobile"
                className="object-cover w-full h-screen"
                style={{ minHeight: '100vh', height: '100vh' }}
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default HeroCarousal;