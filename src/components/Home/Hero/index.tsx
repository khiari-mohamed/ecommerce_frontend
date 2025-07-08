import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-[56px] xl:pt-[80px] bg-[#E5EAF4]">
      {/* Full-width Carousel */}
      <div className="mb-5 rounded-none sm:rounded-[10px] bg-white overflow-hidden shadow-sm">
        <HeroCarousel />
      </div>      
      </section>
  );
};

export default Hero;