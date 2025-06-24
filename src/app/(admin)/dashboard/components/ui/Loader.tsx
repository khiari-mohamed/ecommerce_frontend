import React from "react";

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
  label?: string;
}

export default function Loader({
  size = 32,
  color = "#6366f1", // Tailwind indigo-500
  className = "",
  label,
}: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className="animate-spin-slow"
        style={{
          filter: "drop-shadow(0 2px 8px rgba(99,102,241,0.25))",
        }}
      >
        <defs>
          <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="url(#loader-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="90 150"
          strokeDashoffset="0"
        />
      </svg>
      {label && (
        <span className="mt-2 text-sm text-gray-500 dark:text-gray-300 animate-pulse">{label}</span>
      )}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}