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


const Home = () => {

   const [ventesFlash, setVentesFlash] = useState<import("@/types/venteFlash").VenteFlash[]>([]);

  useEffect(() => {
    getVenteFlashList().then(setVentesFlash);
  }, []);
  return (
    <main>
      <Hero />
      <Categories />
       <BestSeller />
        <NewArrival />
      <StaticVenteFlash products={ventesFlash} />
       <PacksSection />
      <div className="mb-8">
      <MusculationProducts />
      </div>
       <CountdownBlogGrid />
      <Testimonials />
      <BrandSection />
      <HeroFeature />
      </main>
  );
};

export default Home;
