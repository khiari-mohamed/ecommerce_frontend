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

  // Render the countdown UI with new design
  return (
    <div className="bg-gradient-to-r from-[#fff6f6] to-[#fff3e0] p-4 rounded-lg border border-[#fff4f4] w-full" style={{ background: 'linear-gradient(90deg, #fff6f6 0%, #fff3e0 100%)', borderColor: '#fff4f4' }}>
      <div className="flex items-center justify-center gap-4 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock" style={{ color: '#dc2626' }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <h3 className="text-xl font-bold" style={{ color: '#dc2626' }}>Les offres se terminent dans</h3>
      </div>
      <div className="flex justify-center gap-2 md:gap-4 flex-nowrap md:flex-wrap flex-1 min-w-0">
        <div className="flex flex-col items-center">
          <div className="px-3 py-2 rounded-lg font-bold text-lg min-w-[50px] text-center" style={{ background: '#dc2626', color: '#fff', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }}>
            {timeLeft.jours.toString().padStart(2, '0')}
          </div>
          <span className="text-sm text-gray-600 mt-1">jours</span>
        </div>
        <div className="flex items-center text-2xl font-bold" style={{ color: '#dc2626' }}>:</div>
        <div className="flex flex-col items-center">
          <div className="px-3 py-2 rounded-lg font-bold text-lg min-w-[50px] text-center" style={{ background: '#dc2626', color: '#fff', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }}>
            {timeLeft.heures.toString().padStart(2, '0')}
          </div>
          <span className="text-sm text-gray-600 mt-1">heures</span>
        </div>
        <div className="flex items-center text-2xl font-bold" style={{ color: '#dc2626' }}>:</div>
        <div className="flex flex-col items-center">
          <div className="px-3 py-2 rounded-lg font-bold text-lg min-w-[50px] text-center" style={{ background: '#dc2626', color: '#fff', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }}>
            {timeLeft.mins.toString().padStart(2, '0')}
          </div>
          <span className="text-sm text-gray-600 mt-1">minutes</span>
        </div>
        <div className="flex items-center text-2xl font-bold" style={{ color: '#dc2626' }}>:</div>
        <div className="flex flex-col items-center">
          <div className="px-3 py-2 rounded-lg font-bold text-lg min-w-[50px] text-center" style={{ background: '#dc2626', color: '#fff', boxShadow: '0 2px 8px 0 rgba(239,68,68,0.15)' }}>
            {timeLeft.secs.toString().padStart(2, '0')}
          </div>
          <span className="text-sm text-gray-600 mt-1">secondes</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
