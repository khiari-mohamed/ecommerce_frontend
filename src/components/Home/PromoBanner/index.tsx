import React from "react";
import Image from "next/image";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- promo banner big --> */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-dark mb-3">
            Hydro Whey 1,59 kg Optimum Nutrition 
            </span>

            <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
            JUSQU'À 30% DE RÉDUCTION
            </h2>
            <p>
             Protéine hydrolysée ultra-pure pour une absorption rapide et une récupération musculaire optimale. 30 g de protéines par portion.
            </p>
            <a
              href="#"
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Acheter maintenant
            </a>
          </div>

          <Image
            src="/images/promo/hydro.webp"
            alt="promo img"
            className="absolute bottom-0 right-4 lg:right 26 -z-1"
            style={{ bottom: '-30px' }}
            width={500}
            height={750}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/promo/promo-02.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1"
              width={241}
              height={241}
            />

            <div className="text-right">
              <span className="block text-lg text-dark mb-1.5">
              Tapis de course motorisé pliable
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
              Entraînement à domicile
              </h2>

              <p className="font-semibold text-custom-1 text-teal">
              20 % de réduction
              </p>

              <a
                href="#"
                className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
              >
                Profitez-en maintenant
              </a>
            </div>
          </div>

          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/promo/lipo6.webp"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1"
              width={200}
              height={200}
            />

            <div>
              <span className="block text-lg text-dark mb-1.5">
              LIPO 6 BLACK ULTRA CONCENTRATE
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
              Jusqu'à <span className="text-orange">40%</span>réduction
              </h2>

              <p className="max-w-[285px] text-custom-sm">
              LIPO 6 BLACK ULTRA CONCENTRATE (60 CAPS) – Brûleur de graisse ultra-puissant pour une perte de poids rapide et efficace.
              </p>

              <a
                href="#"
                className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
              >
                Profitez-en maintenant
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
