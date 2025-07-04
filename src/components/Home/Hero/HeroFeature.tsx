import React from "react";
import Image from "next/image";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Livraison Rapide",
    description: "LIVRAISON SOUS 24 HEURES",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "Produits Certifiés",
    description: "CERTIFIÉ PAR LE MINSTÈRE DE SANTÉ",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "Paiement à la livraison",
    description: "PAIEMENT SÉCURISÉ",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "Service SOBITAS",
    description: "27 612 500",
  },
];

const HeroFeature = () => {
  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="flex flex-wrap items-center gap-2 xl:gap-4 mt-10">
        {featureData.map((item, key) => (
          <div className="flex items-center gap-2" key={key}>
            <Image src={item.img} alt={item.title} width={40} height={41} loading="lazy" sizes="40px" />

            <div>
              <h3 className="font-medium text-lg text-dark">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;