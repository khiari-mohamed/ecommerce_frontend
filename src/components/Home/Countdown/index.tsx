"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const CounDown = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = "December, 31, 2024";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    // @ts-ignore
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative overflow-hidden z-1 rounded-lg bg-[#D0E9F3] p-4 sm:p-7.5 lg:p-10 xl:p-15 flex flex-col md:flex-row items-center md:items-start">
          <div className="max-w-[422px] w-full z-10">
            <span className="block font-medium text-custom-1 text-blue mb-2.5">
            Ne manquez pas ça !!
            </span>
            <h2 className="font-bold text-dark text-xl lg:text-heading-4 xl:text-heading-3 mb-3">
            LEVRO LEGENDARY MASS – 6.8KG
            </h2>

            <p>Gainer ultra puissant pour une prise de masse rapide et efficace.</p>

            {/* <!-- Countdown timer --> */}
            <div
              className="flex flex-wrap gap-4 sm:gap-6 mt-6 justify-center md:justify-start"
            >
              {/* <!-- timer day --> */}
              <div>
                <span
                  className="min-w-[56px] sm:min-w-[64px] h-12 sm:h-14.5 font-semibold text-lg sm:text-xl lg:text-3xl text-[#ff4500] rounded-lg flex items-center justify-center bg-white shadow-2 px-3 sm:px-4 mb-2"
                >
                  {days < 10 ? "0" + days : days}
                </span>
                <span className="block text-custom-sm text-[#ff4500] text-center">
                  Jours
                </span>
              </div>

              {/* <!-- timer hours --> */}
              <div>
                <span
                  className="min-w-[56px] sm:min-w-[64px] h-12 sm:h-14.5 font-semibold text-lg sm:text-xl lg:text-3xl text-[#ff4500] rounded-lg flex items-center justify-center bg-white shadow-2 px-3 sm:px-4 mb-2"
                >
                  {hours < 10 ? "0" + hours : hours}
                </span>
                <span className="block text-custom-sm text-[#ff4500] text-center">
                  Heures
                </span>
              </div>

              {/* <!-- timer minutes --> */}
              <div>
                <span
                  className="min-w-[56px] sm:min-w-[64px] h-12 sm:h-14.5 font-semibold text-lg sm:text-xl lg:text-3xl text-[#ff4500] rounded-lg flex items-center justify-center bg-white shadow-2 px-3 sm:px-4 mb-2"
                >
                  {minutes < 10 ? "0" + minutes : minutes}
                </span>
                <span className="block text-custom-sm text-[#ff4500] text-center">
                  Minutes
                </span>
              </div>

              {/* <!-- timer seconds --> */}
              <div>
                <span
                  className="min-w-[56px] sm:min-w-[64px] h-12 sm:h-14.5 font-semibold text-lg sm:text-xl lg:text-3xl text-[#ff4500] rounded-lg flex items-center justify-center bg-white shadow-2 px-3 sm:px-4 mb-2"
                >
                  {seconds < 10 ? "0" + seconds : seconds}
                </span>
                <span className="block text-custom-sm text-[#ff4500] text-center">
                  Seconds
                </span>
              </div>
            </div>
            {/* <!-- Countdown timer ends --> */}

            <a
              href="#"
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 w-full sm:w-auto text-center justify-center"
            >
             Vérifiez-le!
            </a>
          </div>

          {/* <!-- bg shapes --> */}
          <div className="relative w-full md:w-auto flex justify-center md:justify-end mt-6 md:mt-0">
            <Image
              src="/images/countdown/countdown-bg.png"
              alt="bg shapes"
              className="object-contain max-h-[120px] sm:max-h-[180px] md:max-h-[220px] w-auto"
              width={220}
              height={120}
            />
            <Image
              src="/images/countdown/pg6.webp"
              alt="product"
              className="hidden lg:block object-contain max-h-[120px] sm:max-h-[180px] md:max-h-[220px] w-auto ml-4"
              width={180}
              height={120}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounDown;
