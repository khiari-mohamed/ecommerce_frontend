import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import MusculationProducts from "./MusculationProducts";
import VenteFlash from "@/components/Home/VenteFlash";
import PacksSection from "./PacksSection/PacksSection";
import BrandSection from "@/components/Home/BrandSection";

const Home = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <VenteFlash products={[]} />
      <NewArrival />
      <PromoBanner />
      <BestSeller />
      <CounDown />
       <PacksSection />
      <MusculationProducts />
      <Testimonials />
      <BrandSection />
      <Newsletter />
    </main>
  );
};

export default Home;
