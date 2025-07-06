"use client";
import React from "react";
import { useEffect, useState } from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import CountdownBlogGrid from "./Countdown";
import Testimonials from "./Testimonials";
import MusculationProducts from "./MusculationProducts";
import PacksSection from "./PacksSection/PacksSection";
import BrandSection from "@/components/Home/BrandSection";
import StaticVenteFlash from "../StaticVenteFlash/StaticVenteFlash";
import { getVenteFlashList } from "@/services/venteFlash";


const Home = () => {

   const [ventesFlash, setVentesFlash] = useState([]);

  useEffect(() => {
    getVenteFlashList().then(setVentesFlash);
  }, []);
  return (
    <main>
      <Hero />
      <Categories />
      <StaticVenteFlash products={ventesFlash} />
      {/* <VenteFlash /> */}
      <NewArrival />
      <PromoBanner />
      <BestSeller />
     <CountdownBlogGrid />
       <PacksSection />
      <div className="mb-8">
      <MusculationProducts />
      </div>
      <Testimonials />
      <BrandSection />
      </main>
  );
};

export default Home;
