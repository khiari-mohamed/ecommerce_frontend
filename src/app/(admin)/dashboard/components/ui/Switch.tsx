import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  color?: string; // Tailwind color e.g. 'bg-blue-500'
}

export default function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
  color = "bg-blue-600",
}: SwitchProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
      <span className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <span
          className={`
            block w-11 h-6 rounded-full transition-colors duration-300
            ${checked ? color : "bg-gray-300 dark:bg-gray-700"}
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          `}
        />
        <span
          className={`
            absolute left-0 top-0 w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow transform transition-transform duration-300
            ${checked ? "translate-x-5" : ""}
            ${disabled ? "opacity-60" : ""}
          `}
        />
      </span>
      {label && (
        <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
      )}
    </label>
  );
}