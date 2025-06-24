import React from "react";

interface CountdownProps {
  timeRemaining: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const Countdown: React.FC<CountdownProps> = ({ timeRemaining }) => {
  return (
    <div className="flex justify-center gap-3 md:gap-6 mb-2">
      {Object.entries(timeRemaining).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div
            className="w-14 h-14 md:w-20 md:h-20 rounded-lg shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-800"
            style={{
              background: "#FF4500", // Orange background
              borderColor: "#FF4500",
            }}
          >
            <span className="text-2xl md:text-4xl font-extrabold text-white drop-shadow">
              {value.toString().padStart(2, "0")}
            </span>
          </div>
          <span
            className="text-xs mt-1 uppercase font-bold tracking-widest"
            style={{
              color: "#FF4500", // Orange text for unit label
            }}
          >
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;