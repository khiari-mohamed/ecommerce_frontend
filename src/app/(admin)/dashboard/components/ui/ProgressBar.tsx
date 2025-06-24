import React from "react";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: string; // Tailwind color e.g. 'bg-blue-500'
  className?: string;
  showValue?: boolean;
}

export default function ProgressBar({
  value,
  label,
  color = "bg-blue-500",
  className = "",
  showValue = true,
}: ProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
          {showValue && (
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">{value}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ease-out ${color}`}
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            boxShadow: "0 2px 8px 0 rgba(59,130,246,0.15)",
          }}
        />
      </div>
    </div>
  );
}