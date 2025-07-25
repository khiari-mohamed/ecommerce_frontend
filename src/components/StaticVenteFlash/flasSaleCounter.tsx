"use client";
import { useState, useEffect } from "react";

type TimeLeft = {
  jours: number;
  heures: number;
  mins: number;
  secs: number;
};

const calculateTimeLeft = (endDate: string): TimeLeft => {
  const difference = +new Date(endDate) - +new Date();
  let timeLeft: TimeLeft = {
    jours: 0,
    heures: 0,
    mins: 0,
    secs: 0,
  };

  if (difference > 0) {
    timeLeft = {
      jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
      heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
      mins: Math.floor((difference / 1000 / 60) % 60),
      secs: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

interface CountdownTimerProps {
  endDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(endDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate, mounted]);

  if (!mounted) return null;

  // Render the countdown UI
  return (
    <div className="flex space-x-2 items-center max-w-full">
      <div className="flex -mx-4 px-1 flex-wrap gap-y-1">
        <div className="px-1">
          <div className="bg-white prod_border w-14 h-14 sm:w-[72px] sm:h-[72px] flex items-center justify-center flex-col">
            <p className="font-bold text-[#ff4000] bg-white px-2 py-0.5 sm:px-4 sm:py-2 rounded text-xl sm:text-2xl tracking-wide shadow-md">
              {timeLeft.jours}
            </p>
            <span className="uppercase text-[10px] sm:text-[12px]">jours</span>
          </div>
        </div>
        <div className="px-1">
          <div className="bg-white prod_border w-14 h-14 sm:w-[72px] sm:h-[72px] flex items-center justify-center flex-col">
            <p className="font-bold text-[#ff4000] bg-white px-2 py-0.5 sm:px-4 sm:py-2 rounded text-xl sm:text-2xl tracking-wide shadow-md">
              {timeLeft.heures}
            </p>
            <span className="uppercase text-[10px] sm:text-[12px]">heures</span>
          </div>
        </div>
        <div className="px-1">
          <div className="bg-white prod_border w-14 h-14 sm:w-[72px] sm:h-[72px] flex items-center justify-center flex-col">
            <p className="font-bold text-[#ff4000] bg-white px-2 py-0.5 sm:px-4 sm:py-2 rounded text-xl sm:text-2xl tracking-wide shadow-md">
              {timeLeft.mins}
            </p>
            <span className="uppercase text-[10px] sm:text-[12px]">mins</span>
          </div>
        </div>
        <div className="px-1">
          <div className="bg-white prod_border w-14 h-14 sm:w-[72px] sm:h-[72px] flex items-center justify-center flex-col">
            <p className="font-bold text-[#ff4000] bg-white px-2 py-0.5 sm:px-4 sm:py-2 rounded text-xl sm:text-2xl tracking-wide shadow-md">
              {timeLeft.secs}
            </p>
            <span className="uppercase text-[10px] sm:text-[12px]">secs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
