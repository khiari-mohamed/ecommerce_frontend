"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useCallback, useRef } from "react";
import { useTestimonials } from '../../../services/useTestimonials';
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";

const Testimonials = () => {
  const sliderRef = useRef<any>(null);
  const { testimonials, loading } = useTestimonials();

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  // Deduplicate testimonials by review + authorName without changing type or logic
  const filteredTestimonials = (() => {
    const seen = new Set<string>();
    return testimonials.filter(item => {
      const review = item.review?.trim();
      const name = item.authorName?.trim().toLowerCase();
      const key = `${name}-${review}`;
      if (!review || review.length < 4 || !name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  return (
    <section className="overflow-hidden pb-10 sm:pb-14 md:pb-16.5 pt-8 sm:pt-12 md:pt-16 bg-white w-full">
      <div className="max-w-[1170px] w-full mx-auto px-2 sm:px-4 md:px-8 xl:px-0">
        <div className="swiper testimonial-carousel common-carousel p-2 sm:p-5 w-full">
          <div className="mb-8 sm:mb-10 flex flex-col gap-4">
            <h2
              className="font-semibold text-xl sm:text-xl xl:text-heading-5 text-center w-full"
              style={{ color: '#FF4500' }}
            >
              Commentaires des utilisateurs
            </h2>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-end w-full sm:w-auto">
            <div onClick={handlePrev} className="swiper-button-prev cursor-pointer">
              <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                />
              </svg>
            </div>
            <div onClick={handleNext} className="swiper-button-next cursor-pointer">
              <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                />
              </svg>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : (
            <Swiper
              ref={sliderRef}
              slidesPerView={1}
              spaceBetween={24}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              modules={[Autoplay]}
              direction="horizontal"
              loop={false}
              style={{ width: '100%' }}
              breakpoints={{
                0: { slidesPerView: 1 },
                480: { slidesPerView: 1.1 },
                600: { slidesPerView: 1.2 },
                800: { slidesPerView: 2 },
                1100: { slidesPerView: 3 },
                1400: { slidesPerView: 4 },
              }}
              className="!pb-8 md:!pb-10"
            >
              {filteredTestimonials.map((item, key) => (
                <SwiperSlide key={key} style={{ display: 'flex', height: '100%', minWidth: 0 }}>
                  <div className="w-full max-w-[300px] mx-auto">
                    <SingleItem testimonial={item} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
