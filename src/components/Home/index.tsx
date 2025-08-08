"use client";
import React from "react";
import { useEffect, useState } from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import BestSeller from "./BestSeller";
import CountdownBlogGrid from "./Countdown";
import Testimonials from "./Testimonials";
import MusculationProducts from "./MusculationProducts";
import PacksSection from "./PacksSection/PacksSection";
import BrandSection from "@/components/Home/BrandSection";
import StaticVenteFlash from "../StaticVenteFlash/StaticVenteFlash";
import { getVenteFlashList } from "@/services/venteFlash";
import HeroFeature from "./Hero/HeroFeature";
import TopPromotionSection from "./TopPromotion";


const Home = () => {

   const [ventesFlash, setVentesFlash] = useState<import("@/types/venteFlash").VenteFlash[]>([]);

  useEffect(() => {
    getVenteFlashList().then(setVentesFlash);
  }, []);
  return (
    <main>
      <Hero />
      <div className="-mt-16">
        <Categories />
      </div>
      <div className="-mt-24">
        <TopPromotionSection />
      </div>
      <div className="-mt-24">
        <BestSeller />
      </div>
      <div className="-mt-24">
        <NewArrival />
      </div>
      <div className="-mt-24">
        <StaticVenteFlash products={ventesFlash} />
      </div>
      <div className="-mt-24">
        <PacksSection />
      </div>
      <div className="-mt-24">
        <MusculationProducts />
      </div>
      <div className="-mt-10">
        <CountdownBlogGrid />
      </div>
      <div className="-mt-24">
        <Testimonials />
      </div>
      <div className="-mt-24">
        <BrandSection />
      </div>
      <div className="-mt-14">
        <HeroFeature />
      </div>
    </main>
  );
};

export default Home;
