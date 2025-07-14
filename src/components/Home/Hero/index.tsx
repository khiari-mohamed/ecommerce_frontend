import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="overflow-hidden min-h-[calc(100vh-56px)] xl:min-h-[calc(100vh-80px)] pt-0 sm:pt-[140px] xl:pt-[180px] bg-[#E5EAF4]">
    {/* Full-width Carousel */}
    <div className="mb-0 rounded-none sm:rounded-[10px] bg-white overflow-hidden shadow-sm h-full">
    <HeroCarousel />
    </div>
    </section>
  );
};

export default Hero;