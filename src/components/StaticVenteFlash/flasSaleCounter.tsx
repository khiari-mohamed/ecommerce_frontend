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
          <div className="bg-gray-200 prod_border w-[60px] h-[60px] flex items-center justify-center flex-col">
            <p className="font-medium">{timeLeft.jours}</p>
            <span className="uppercase text-[10px]">jours</span>
          </div>
        </div>
        <div className="px-1">
          <div className="bg-gray-200 prod_border w-[60px] h-[60px] flex items-center justify-center flex-col">
            <p className="font-medium">{timeLeft.heures}</p>
            <span className="uppercase text-[10px]">heures</span>
          </div>
        </div>
        <div className="px-1">
          <div className="bg-gray-200 prod_border w-[60px] h-[60px] flex items-center justify-center flex-col">
            <p className="font-medium">{timeLeft.mins}</p>
            <span className="uppercase text-[10px]">mins</span>
          </div>
        </div>
        <div className="px-1">
          <div className="bg-gray-200 prod_border w-[60px] h-[60px] flex items-center justify-center flex-col">
            <p className="font-medium">{timeLeft.secs}</p>
            <span className="uppercase text-[10px]">secs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
